using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using GSLP.Application.Common.Helper;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Platform.LicencaService;
using GSLP.Application.Utility;
using GSLP.Domain.Entities.Common;
using GSLP.Infrastructure.Auth.JWT.DTOs;
using GSLP.Infrastructure.Encryption;
using GSLP.Infrastructure.Persistence.Contexts;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace GSLP.Infrastructure.Auth.JWT
{
  public class ClientTokenService : IClientTokenService
  {
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ILicencaService _licencaService;
    private readonly JWTSettings _jwtSettings;
    private readonly IEncryptionService _encryptionService;
    private readonly ApplicationDbContext _dbContext;
    private readonly IHelperService _helperService;

    public ClientTokenService(
      UserManager<ApplicationUser> userManager,
      SignInManager<ApplicationUser> signInManager,
      ILicencaService licencaService,
      IOptions<JWTSettings> jwtSettings,
      IEncryptionService encryptionService,
      ApplicationDbContext dbContext,
      IHelperService helperService
    )
    {
      _userManager = userManager;
      _signInManager = signInManager;
      _licencaService = licencaService;
      _jwtSettings = jwtSettings.Value;
      _encryptionService = encryptionService;
      _dbContext = dbContext;
      _helperService = helperService;
    }

    public async Task<Response<ClientTokenResponse>> GetClientTokenAsync(ClientTokenRequest request)
    {
      // Get API key from header
      string? clientApiKey = await _helperService.GetAPIKeyFromHttpContextAsync();
      if (string.IsNullOrEmpty(clientApiKey))
        return Response<ClientTokenResponse>.Fail("API Key em falta");

      // Find user and validate credentials
      ApplicationUser user = await _userManager.FindByEmailAsync(request.Email);
      if (user == null || !user.IsActive)
      {
        return Response<ClientTokenResponse>.Fail("Credenciais inválidas");
      }

      // Verify user is in client role and not in admin roles
      IList<string> roles = await _userManager.GetRolesAsync(user);
      if (!roles.Contains("client") || roles.Contains("administrator") || roles.Contains("admin"))
      {
        return Response<ClientTokenResponse>.Fail("Acesso não autorizado");
      }

      // Validate password
      SignInResult signInResult = await _signInManager.CheckPasswordSignInAsync(
        user,
        request.Password,
        false
      );
      if (!signInResult.Succeeded)
      {
        return Response<ClientTokenResponse>.Fail("Credenciais inválidas");
      }

      // Validate client API key
      var licencaAPIKey = await _dbContext
        .LicencasAPIKeys.Include(k => k.Licenca)
        .FirstOrDefaultAsync(k => k.APIKey == clientApiKey);

      if (licencaAPIKey == null || !licencaAPIKey.Ativo)
      {
        return Response<ClientTokenResponse>.Fail("Chave de API do cliente inválida");
      }

      if (licencaAPIKey.Licenca == null || !licencaAPIKey.Licenca.Ativo)
      {
        return Response<ClientTokenResponse>.Fail("Licença inativa ou inválida");
      }

      // Validate user belongs to the license
      Domain.Entities.Catalog.Platform.LicencaUtilizador userLicense =
        await _dbContext.LicencasUtilizadores.FirstOrDefaultAsync(lu =>
          lu.LicencaId == licencaAPIKey.LicencaId && lu.UtilizadorId == user.Id
        );

      if (userLicense == null || !userLicense.Ativo)
      {
        return Response<ClientTokenResponse>.Fail("Utilizador não associado à licença");
      }

      // Generate refresh token
      string refreshToken = GenerateRefreshToken();
      user.RefreshToken = refreshToken;
      user.RefreshTokenExpiryTime = DateTime.Now.AddDays(_jwtSettings.RefreshTokenDurationInDays);
      _ = await _userManager.UpdateAsync(user);

      // Generate client API token
      string token = GenerateClientToken(user, clientApiKey, licencaAPIKey.Licenca);

      var (permissions, licensedModules) = await GetUserPermissions(
        user.Id,
        licencaAPIKey.LicencaId
      );

      return Response<ClientTokenResponse>.Success(
        new ClientTokenResponse
        {
          Token = token,
          RefreshToken = refreshToken,
          ExpiryTime = DateTime.Now.AddMinutes(_jwtSettings.AuthTokenDurationInMinutes),
          License = new LicenseInfo
          {
            ExpirationDate = licencaAPIKey.Licenca.DataFim,
            IsActive = licencaAPIKey.Licenca.Ativo,
            Permissions = permissions,
            Modules = licensedModules,
          },
          User = new UserInfo
          {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            ImageUrl = user.ImageUrl,
            PhoneNumber = user.PhoneNumber,
            IsActive = user.IsActive,
            ClienteId = user.ClienteId?.ToString(),
          },
        }
      );
    }

    public async Task<Response<ClientTokenResponse>> RefreshClientTokenAsync(string refreshToken)
    {
      // Get API key from helper service
      string? clientApiKey = await _helperService.GetAPIKeyFromHttpContextAsync();
      if (string.IsNullOrEmpty(clientApiKey))
        return Response<ClientTokenResponse>.Fail("API Key em falta");

      ApplicationUser user = _userManager.Users.FirstOrDefault(u => u.RefreshToken == refreshToken);
      if (user == null)
      {
        return Response<ClientTokenResponse>.Fail("Token inválido");
      }

      if (user.RefreshTokenExpiryTime < DateTime.Now)
      {
        return Response<ClientTokenResponse>.Fail("Refresh token expirado");
      }

      // Validate client API key again
      var licencaAPIKey = await _dbContext
        .LicencasAPIKeys.Include(k => k.Licenca)
        .FirstOrDefaultAsync(k => k.APIKey == clientApiKey);

      if (licencaAPIKey == null || !licencaAPIKey.Ativo)
      {
        return Response<ClientTokenResponse>.Fail("Chave de API do cliente inválida");
      }

      // Validate user belongs to the license
      var userLicense = await _dbContext.LicencasUtilizadores.FirstOrDefaultAsync(lu =>
        lu.LicencaId == licencaAPIKey.LicencaId && lu.UtilizadorId == user.Id
      );

      if (userLicense == null || !userLicense.Ativo)
      {
        return Response<ClientTokenResponse>.Fail("Utilizador não associado à licença");
      }

      // Generate new token
      string token = GenerateClientToken(user, clientApiKey, licencaAPIKey.Licenca);

      var (permissions, modules) = await GetUserPermissions(user.Id, licencaAPIKey.LicencaId);

      return Response<ClientTokenResponse>.Success(
        new ClientTokenResponse
        {
          Token = token,
          RefreshToken = user.RefreshToken,
          ExpiryTime = DateTime.Now.AddMinutes(_jwtSettings.AuthTokenDurationInMinutes),
          License = new LicenseInfo
          {
            ExpirationDate = licencaAPIKey.Licenca.DataFim,
            IsActive = licencaAPIKey.Licenca.Ativo,
            Permissions = permissions,
            Modules = modules,
          },
          User = new UserInfo
          {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            ImageUrl = user.ImageUrl,
            PhoneNumber = user.PhoneNumber,
            IsActive = user.IsActive,
            ClienteId = user.ClienteId?.ToString(),
          },
        }
      );
    }

    private async Task<(
      Dictionary<string, int> Permissions,
      List<string> LicensedModules
    )> GetUserPermissions(string userId, Guid licencaId)
    {
      Domain.Entities.Catalog.Platform.Perfil perfil = await _dbContext
        .Perfis.Include(p => p.PerfisFuncionalidades)
        .ThenInclude(pf => pf.Funcionalidade)
        .ThenInclude(f => f.Modulo)
        .FirstOrDefaultAsync(p =>
          p.LicencaId == licencaId && p.PerfisUtilizadores.Any(pu => pu.UtilizadorId == userId)
        );

      if (perfil == null)
        return (new Dictionary<string, int>(), new List<string>());

      var permissions = perfil.PerfisFuncionalidades.ToDictionary(
        pf => pf.FuncionalidadeId.ToString(),
        pf =>
        {
          int bitmask = 0;
          if (pf.AuthVer)
            bitmask |= 1 << 0; // Set bit 0 (AuthVer)
          if (pf.AuthAdd)
            bitmask |= 1 << 1; // Set bit 1 (AuthAdd)
          if (pf.AuthChg)
            bitmask |= 1 << 2; // Set bit 2 (AuthChg)
          if (pf.AuthDel)
            bitmask |= 1 << 3; // Set bit 3 (AuthDel)
          if (pf.AuthPrt)
            bitmask |= 1 << 4; // Set bit 4 (AuthPrt)
          return bitmask;
        }
      );

      // Get unique module IDs where the user has at least one permission
      var licensedModules = perfil
        .PerfisFuncionalidades.Where(pf => pf.Funcionalidade?.Modulo != null)
        .Select(pf => pf.Funcionalidade.Modulo.Id.ToString())
        .Distinct()
        .ToList();

      return (permissions, licensedModules);
    }

    private string GenerateClientToken(
      ApplicationUser user,
      string clientApiKey,
      Domain.Entities.Catalog.Platform.Licenca license
    )
    {
      // Get the specific chars from the APIKey (same as TokenService)
      string specificChars = GSLPHelpers.GetSpecificChars(clientApiKey, [19, 11, 12, 25]);
      string encryptedCode = _encryptionService.EncryptString(specificChars);

      var claims = new List<Claim>
      {
        new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim(JwtRegisteredClaimNames.Name, $"{user.FirstName} {user.LastName}"),
        new Claim("uid", user.Id),
        new Claim("code", encryptedCode),
        // Add role claim
        new Claim("roles", "client"),
      };

      SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(_jwtSettings.Key));
      SigningCredentials creds = new(key, SecurityAlgorithms.HmacSha256);

      JwtSecurityToken token = new(
        issuer: _jwtSettings.Issuer,
        audience: _jwtSettings.Audience, // Changed from "ClientAPI" to match TokenService
        claims: claims,
        expires: DateTime.Now.AddMinutes(_jwtSettings.AuthTokenDurationInMinutes),
        signingCredentials: creds
      );

      return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateRefreshToken()
    {
      byte[] randomNumber = new byte[32];
      using RandomNumberGenerator generator = RandomNumberGenerator.Create();
      generator.GetBytes(randomNumber);
      return Convert.ToBase64String(randomNumber).TrimEnd('=').Replace('+', '-').Replace('/', '_');
    }
  }
}
