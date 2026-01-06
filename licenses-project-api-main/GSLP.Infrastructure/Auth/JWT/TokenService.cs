using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using GSLP.Application.Common.Helper;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Platform.LicencaService;
using GSLP.Application.Services.Platform.LicencaService.DTOs;
using GSLP.Application.Services.Platform.LicencaUtilizadorService;
using GSLP.Application.Utility;
using GSLP.Domain.Entities.Common;
using GSLP.Infrastructure.Auth.JWT.DTOs;
using GSLP.Infrastructure.Encryption;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace GSLP.Infrastructure.Auth.JWT // token service - on login returns JWT tokens to authenticated users
{
  public class TokenService : ITokenService
  {
    private readonly JWTSettings _jwtSettings;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IEncryptionService _encryptionService;
    private readonly IHelperService _helperService;
    private readonly ILicencaUtilizadorRepository _licencaUtilizadorRepository;
    private readonly ILicencaService _licencaService;

    public TokenService(
      IOptions<JWTSettings> JWTSettings,
      UserManager<ApplicationUser> userManager,
      SignInManager<ApplicationUser> signInManager,
      IEncryptionService encryptionService,
      IHelperService helperService,
      ILicencaUtilizadorRepository licencaUtilizadorRepository,
      ILicencaService licencaService
    )
    {
      _jwtSettings = JWTSettings.Value;
      _userManager = userManager;
      _signInManager = signInManager;
      _encryptionService = encryptionService;
      _helperService = helperService;
      _licencaUtilizadorRepository = licencaUtilizadorRepository;
      _licencaService = licencaService;
    }

    // JWT auth token
    public async Task<Response<TokenResponse>> GetTokenResponseAsync(TokenRequest request)
    {
      // Get user and validate basic info first
      ApplicationUser user = await _userManager.FindByEmailAsync(request.Email);
      if (user == null)
        return Response<TokenResponse>.Fail("Utilizador inválido");

      if (user.IsActive == false)
        return Response<TokenResponse>.Fail("Conta de utilizador desativada");

      // Get user roles
      IList<string> userRoles = await _userManager.GetRolesAsync(user);
      bool isAdminRole = userRoles.Any(r => r is "admin" or "administrator");

      // Get license based on role
      LicencaDTO licencaResponse;
      string APIKey;

      if (isAdminRole)
      {
        // For admin, get license from user's association
        var userLicense = await _licencaUtilizadorRepository.GetUserLicencaIdAsync(user.Id);
        if (!userLicense.HasValue)
          return Response<TokenResponse>.Fail("Administrador não tem licença associada");

        // Get the license details
        var licencaResult = await _licencaService.GetLicencaResponseAsync(userLicense.Value);
        if (!licencaResult.Succeeded)
          return Response<TokenResponse>.Fail("Licença inválida");

        licencaResponse = licencaResult.Data;
        APIKey = licencaResponse.APIKey; // Assuming APIKey is included in LicencaDTO
      }
      else
      {
        // For non-admin users, use API key validation
        APIKey = await _helperService.GetAPIKeyFromHttpContextAsync();
        if (string.IsNullOrEmpty(APIKey))
          return Response<TokenResponse>.Fail("API Key em falta");

        licencaResponse = await _licencaService.GetLicencaByAPIKeyAsync(APIKey);
        if (licencaResponse == null)
          return Response<TokenResponse>.Fail("Licença inválida");

        // Check if non-admin user belongs to the license
        bool hasLicenseAccess = await _licencaUtilizadorRepository.RelationshipExistsAsync(
          Guid.Parse(licencaResponse.Id),
          user.Id
        );

        if (!hasLicenseAccess)
          return Response<TokenResponse>.Fail("Utilizador não pertence à licença");
      }

      // Validate credentials
      SignInResult result = await _signInManager.PasswordSignInAsync(
        user.UserName,
        request.Password,
        false,
        lockoutOnFailure: false
      );

      if (!result.Succeeded)
        return Response<TokenResponse>.Fail("Sem autorização");

      if (!user.EmailConfirmed)
        return Response<TokenResponse>.Fail("Sem autorização");

      // Generate tokens
      string refreshToken = GenerateRefreshToken();
      DateTime refreshTokenExpiryTime = DateTime.Now.AddDays(
        _jwtSettings.RefreshTokenDurationInDays
      );
      user.RefreshToken = refreshToken;
      user.RefreshTokenExpiryTime = refreshTokenExpiryTime;
      _ = await _userManager.UpdateAsync(user);

      JwtSecurityToken jwtSecurityToken = await GenerateJWTToken(user, APIKey);

      TokenResponse response = new()
      {
        Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken),
        RefreshToken = refreshToken,
        RefreshTokenExpiryTime = refreshTokenExpiryTime,
        Data = new UserBaseDataDTO
        {
          ClienteId = user.ClienteId.HasValue ? user.ClienteId.Value.ToConsistentString() : null,
          LicencaId = licencaResponse.Id,
        },
      };
      return Response<TokenResponse>.Success(response);
    }

    // refresh token
    public async Task<Response<TokenResponse>> RefreshTokenResponseAsync(string refreshToken)
    {
      ApplicationUser user = _userManager.Users.FirstOrDefault(u => u.RefreshToken == refreshToken);
      if (user == null)
      {
        return Response<TokenResponse>.Fail("Token inválido");
      }

      if (user.RefreshTokenExpiryTime < DateTime.Now)
      {
        return Response<TokenResponse>.Fail("Refresh token expirado");
      }

      // Get user roles
      IList<string> userRoles = await _userManager.GetRolesAsync(user);
      bool isAdminRole = userRoles.Any(r => r is "admin");

      // Get license based on role
      LicencaDTO licencaResponse;
      string APIKey;

      if (isAdminRole)
      {
        // For admin, get license from user's association
        var userLicense = await _licencaUtilizadorRepository.GetUserLicencaIdAsync(user.Id);
        if (!userLicense.HasValue)
          return Response<TokenResponse>.Fail("Admin não tem licença associada");

        // Get the license details
        var licencaResult = await _licencaService.GetLicencaResponseAsync(userLicense.Value);
        if (!licencaResult.Succeeded)
          return Response<TokenResponse>.Fail("Licença inválida");

        licencaResponse = licencaResult.Data;
        APIKey = licencaResponse.APIKey;
      }
      else
      {
        // For non-admin users, use API key validation
        APIKey = await _helperService.GetAPIKeyFromHttpContextAsync();
        if (string.IsNullOrEmpty(APIKey))
          return Response<TokenResponse>.Fail("API Key em falta");

        licencaResponse = await _licencaService.GetLicencaByAPIKeyAsync(APIKey);
        if (licencaResponse == null)
          return Response<TokenResponse>.Fail("Licença inválida");

        // Check if non-admin user belongs to the license
        bool hasLicenseAccess = await _licencaUtilizadorRepository.RelationshipExistsAsync(
          Guid.Parse(licencaResponse.Id),
          user.Id
        );

        if (!hasLicenseAccess)
          return Response<TokenResponse>.Fail("Utilizador não pertence à licença");
      }

      // create token response
      JwtSecurityToken jwtSecurityToken = await GenerateJWTToken(user, APIKey);
      TokenResponse response = new()
      {
        Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken),
        RefreshToken = user.RefreshToken,
        RefreshTokenExpiryTime = user.RefreshTokenExpiryTime,
        Data = new UserBaseDataDTO
        {
          ClienteId = user.ClienteId.HasValue ? user.ClienteId.Value.ToConsistentString() : null,
          LicencaId = licencaResponse.Id,
        },
      };
      return Response<TokenResponse>.Success(response);
    }

    private async Task<JwtSecurityToken> GenerateJWTToken(ApplicationUser user, string APIKey)
    {
      IList<string> roles = await _userManager.GetRolesAsync(user);

      List<Claim> roleClaims = [];
      for (int i = 0; i < roles.Count; i++)
      {
        roleClaims.Add(new Claim("roles", roles[i]));
      }

      // Get user's licencaId
      Guid? licencaId = await _licencaUtilizadorRepository.GetUserLicencaIdAsync(user.Id);

      // Get the specific chars from the APIKey
      string specificChars = GSLPHelpers.GetSpecificChars(APIKey, [19, 11, 12, 25]);

      // Encrypt the specific chars using the injected EncryptionService
      string encryptedCode = _encryptionService.EncryptString(specificChars);

      var claims = new List<Claim>
      {
        new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim(JwtRegisteredClaimNames.Name, $"{user.FirstName} {user.LastName}"),
        new Claim("uid", user.Id),
        new Claim("code", encryptedCode),
      };

      claims.AddRange(roleClaims);

      SymmetricSecurityKey symmetricSecurityKey = new(Encoding.UTF8.GetBytes(_jwtSettings.Key));
      SigningCredentials signingCredentials = new(
        symmetricSecurityKey,
        SecurityAlgorithms.HmacSha256
      );

      JwtSecurityToken jwtSecurityToken = new(
        issuer: _jwtSettings.Issuer,
        audience: _jwtSettings.Audience,
        claims: claims,
        expires: DateTime.Now.AddMinutes(_jwtSettings.AuthTokenDurationInMinutes),
        signingCredentials: signingCredentials
      );

      return jwtSecurityToken;
    }

    private static string GenerateRefreshToken()
    {
      byte[] randomNumber = new byte[32];
      using RandomNumberGenerator generator = RandomNumberGenerator.Create();
      generator.GetBytes(randomNumber);
      string refreshToken = Convert
        .ToBase64String(randomNumber)
        .TrimEnd('=')
        .Replace('+', '-')
        .Replace('/', '_');
      return refreshToken;
    }
  }
}
