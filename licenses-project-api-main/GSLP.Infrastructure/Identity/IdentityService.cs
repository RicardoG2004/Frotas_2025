using System.Globalization;
using AutoMapper;
using GSLP.Application.Common;
using GSLP.Application.Common.Filter;
using GSLP.Application.Common.Helper;
using GSLP.Application.Common.Identity;
using GSLP.Application.Common.Identity.DTOs;
using GSLP.Application.Common.Identity.Filters;
using GSLP.Application.Common.Images;
using GSLP.Application.Common.Mailer;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services;
using GSLP.Application.Services.Platform.ClienteService.Specifications;
using GSLP.Application.Services.Platform.LicencaUtilizadorService;
using GSLP.Application.Services.Platform.PerfilService.DTOs;
using GSLP.Application.Services.Platform.PerfilUtilizadorService;
using GSLP.Application.Utility;
using GSLP.Domain.Entities.Catalog.Platform;
using GSLP.Domain.Entities.Common;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace GSLP.Infrastructure.Identity
{
    public class IdentityService : BaseService, IIdentityService // identity service (user management, profiles, password, preferences)
    {
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ICurrentTenantUserService _currentTenantUserService;
        private readonly IMailService _mailService;
        private readonly IImageService _imageService;
        private readonly IHelperService _helperService;
        private readonly ILicencaUtilizadorService _licencaUtilizadorService;
        private readonly IPerfilUtilizadorService _perfilUtilizadorService;

        public IdentityService(
            IMapper mapper,
            UserManager<ApplicationUser> userManager,
            ICurrentTenantUserService currentTenantUserService,
            IMailService mailService,
            IImageService imageService,
            IRepositoryAsync repository,
            IHelperService helperService,
            ILicencaUtilizadorService licencaUtilizadorService,
            IPerfilUtilizadorService perfilUtilizadorService
        )
            : base(repository)
        {
            _userManager = userManager; // user manager (service provided by aspnetcore.identity)
            _currentTenantUserService = currentTenantUserService; // current tenant & user service (with values set in middleware)
            _mailService = mailService; // mail service - forgotten password, confirm user
            _imageService = imageService; // image service - profile image upload
            _mapper = mapper; // automapper
            _helperService = helperService;
            _licencaUtilizadorService = licencaUtilizadorService;
            _perfilUtilizadorService = perfilUtilizadorService;
        }

        // USER MANAGEMENT (admin-level permissions)
        #region [-- USER MANAGEMENT --]
        // get user list -- client-side pagination
        public async Task<Response<IEnumerable<UserDto>>> GetUsersResponseAsync(
            Guid? clienteId = null
        )
        {
            // If clientId is provided, filter users by clientId; otherwise, get all users.
            IQueryable<ApplicationUser> usersQuery = _userManager
                .Users.OrderByDescending(x => x.CreatedOn)
                .Include(x => x.Cliente)
                .Include(x => x.PerfisUtilizadores)
                .Include(x => x.LicencasUtilizadores)
                .ThenInclude(lu => lu.Licenca);

            if (clienteId.HasValue)
            {
                usersQuery = usersQuery.Where(x => x.ClienteId == clienteId.Value); // Assuming ApplicationUser has a ClientId property
            }

            List<ApplicationUser> usersList = await usersQuery.ToListAsync();

            foreach (ApplicationUser user in usersList)
            {
                Task<IList<string>> roles = _userManager.GetRolesAsync(user);
                string roleId = roles.Result.FirstOrDefault();
                user.RoleId = roleId; // RoleId is a non-mapped property in the ApplicationUser class
            }

            List<UserDto> dtoList = _mapper.Map<List<UserDto>>(usersList);

            return Response<IEnumerable<UserDto>>.Success(dtoList);
        }

        // get user details
        public async Task<Response<UserDto>> GetUserDetailsResponseAsync(Guid id)
        {
            ApplicationUser user = await _userManager
                .Users.Where(x => x.Id == id.ToString())
                .Include(x => x.Cliente)
                .Include(x => x.PerfisUtilizadores)
                .Include(x => x.LicencasUtilizadores)
                .ThenInclude(lu => lu.Licenca)
                .FirstOrDefaultAsync();
            if (user == null)
            {
                return Response<UserDto>.Fail("O utilizador não existe");
            }

            Task<IList<string>> roles = _userManager.GetRolesAsync(user);
            string roleId = roles.Result.FirstOrDefault();
            user.RoleId = roleId;

            UserDto responseDto = _mapper.Map(user, new UserDto());

            return Response<UserDto>.Success(responseDto);
        }

        // register new user
        public async Task<Response<UserDto>> RegisterUserResponseAsync(RegisterUserRequest request)
        {
            ApplicationUser userExist = await _userManager.FindByEmailAsync(request.Email);
            if (userExist != null)
            {
                return Response<UserDto>.Fail("O utilizador já existe");
            }

            Guid clienteId = Guid.Parse(request.ClienteId);

            ClienteMatchId clienteMatchId = new(clienteId);
            bool clienteExists = await _repository.ExistsAsync<Cliente, Guid>(clienteMatchId);

            if (!clienteExists)
            {
                return Response<UserDto>.Fail("O cliente é inválido");
            }

            ApplicationUser user = new()
            {
                UserName = request.Email + "." + GSLPHelpers.GenerateHex(4),
                FirstName = request.FirstName,
                LastName = request.LastName,
                PhoneNumber = request.PhoneNumber,
                Email = request.Email,
                EmailConfirmed = true,
                IsActive = true,
                ClienteId = clienteId,
            };

            IdentityResult result = await _userManager.CreateAsync(user, request.Password);
            if (result.Succeeded)
            {
                _ = await _userManager.AddToRoleAsync(user, request.RoleId);
                user.RoleId = request.RoleId;

                // Handle license association based on role
                if (!string.IsNullOrEmpty(request.LicencaId))
                {
                    bool isAdminRole =
                        request.RoleId.Equals("admin", StringComparison.OrdinalIgnoreCase)
                        || request.RoleId.Equals(
                            "administrator",
                            StringComparison.OrdinalIgnoreCase
                        );

                    List<string> licencaErrors =
                        await _licencaUtilizadorService.UpdateLicencaUtilizadorStatusResponseAsync(
                            Guid.Parse(request.LicencaId),
                            user.Id,
                            isAdminRole // true for admin/administrator, false for client
                        );

                    if (licencaErrors != null && licencaErrors.Count > 0)
                    {
                        // If license association fails, delete the created user
                        _ = await _userManager.DeleteAsync(user);
                        return Response<UserDto>.Fail(licencaErrors);
                    }
                }

                UserDto responseDto = _mapper.Map(user, new UserDto());
                return Response<UserDto>.Success(responseDto);
            }
            else
            {
                List<string> messages = [];
                foreach (IdentityError error in result.Errors)
                {
                    messages.Add(error.Description);
                }
                return Response<UserDto>.Fail(messages);
            }
        }

        // update user
        public async Task<Response<UserDto>> UpdateUserResponseAsync(
            UpdateUserRequest request,
            Guid id
        )
        {
            ApplicationUser user = await _userManager.FindByIdAsync(id.ToString());

            if (user == null)
            {
                return Response<UserDto>.Fail("Não encontrado");
            }

            IList<string> roles = await _userManager.GetRolesAsync(user);
            if (roles.FirstOrDefault() == "root") // prevent editing root user
            {
                return Response<UserDto>.Fail("Não é possível editar o root user");
            }

            if (id == Guid.Parse(_currentTenantUserService.UserId)) // prevent editing current user
            {
                return Response<UserDto>.Fail("Não é possível atualizar o utilizador atual");
            }

            if (request.Email != user.Email) // check if email already in use
            {
                ApplicationUser userExist = await _userManager.FindByEmailAsync(request.Email);
                if (userExist != null)
                {
                    return Response<UserDto>.Fail("O email já está a ser usado");
                }
            }

            ApplicationUser updatedUser = _mapper.Map(request, user); // map to application user
            IdentityResult result = await _userManager.UpdateAsync(updatedUser); // save the changes

            if (result.Succeeded)
            {
                if (request.RoleId != roles.FirstOrDefault())
                {
                    // If changing from client to admin/administrator role, remove perfil associations
                    if (
                        roles.Contains("client")
                        && (
                            request.RoleId.Equals("admin", StringComparison.OrdinalIgnoreCase)
                            || request.RoleId.Equals(
                                "administrator",
                                StringComparison.OrdinalIgnoreCase
                            )
                        )
                    )
                    {
                        // Get existing perfis for the user
                        IEnumerable<PerfilDTO> existingPerfis =
                            await _perfilUtilizadorService.GetPerfisByUtilizadorIdAsync(user.Id);

                        // Remove all perfil associations
                        foreach (PerfilDTO perfil in existingPerfis)
                        {
                            _ =
                                await _perfilUtilizadorService.RemoveUtilizadorFromPerfilResponseAsync(
                                    Guid.Parse(perfil.Id),
                                    user.Id
                                );
                        }
                    }

                    // Update roles
                    _ = await _userManager.RemoveFromRolesAsync(user, [.. roles]);
                    _ = await _userManager.AddToRoleAsync(user, request.RoleId);
                }

                UserDto updatedUserDTO = _mapper.Map(updatedUser, new UserDto());
                return Response<UserDto>.Success(updatedUserDTO);
            }
            else
            {
                List<string> messages = [];
                foreach (IdentityError error in result.Errors)
                {
                    messages.Add(error.Description);
                }
                return Response<UserDto>.Fail(messages);
            }
        }

        // delete user
        public async Task<Response<Guid>> DeleteUserResponseAsync(Guid id)
        {
            try
            {
                ApplicationUser user = await _userManager.FindByIdAsync(id.ToString());
                if (user == null)
                {
                    return Response<Guid>.Fail("Não encontrado");
                }

                if (id == Guid.Parse(_currentTenantUserService.UserId)) // prevent editing current user
                {
                    return Response<Guid>.Fail("Não é possível apagar o utilizador atual");
                }

                // Retrieve all associated perfis for the user
                IEnumerable<Application.Services.Platform.PerfilService.DTOs.PerfilDTO> existingPerfis =
                    await _perfilUtilizadorService.GetPerfisByUtilizadorIdAsync(user.Id);
                if (existingPerfis != null)
                {
                    // Remove the user from all associated perfis
                    foreach (
                        Application.Services.Platform.PerfilService.DTOs.PerfilDTO perfil in existingPerfis
                    )
                    {
                        _ = await _perfilUtilizadorService.RemoveUtilizadorFromPerfilResponseAsync(
                            Guid.Parse(perfil.Id!),
                            user.Id
                        );
                    }
                }

                // Check for the associated licenca and remove the user from it if necessary
                Licenca licenca = await GetLicencaByUtilizadorIdAsync(user.Id);
                if (licenca != null)
                {
                    // Logic to remove user from licenca or delete it if applicable
                    _ = await _licencaUtilizadorService.RemoveUtilizadorFromLicencaResponseAsync(
                        licenca.Id,
                        user.Id
                    );
                }

                IdentityResult result = await _userManager.DeleteAsync(user);

                return !result.Succeeded
                    ? Response<Guid>.Fail(
                        "Erro ao apagar o utilizador: "
                            + string.Join(", ", result.Errors.Select(e => e.Description))
                    )
                    : Response<Guid>.Success(id);
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }
        #endregion [-- USER MANAGEMENT --]

        // PROFILE (basic-level permissions)
        #region [-- PROFILE --]
        // get profile
        public async Task<Response<UserDto>> GetProfileDetailsResponseAsync()
        {
            ApplicationUser currentUser = await _userManager
                .Users.Where(x => x.Id == _currentTenantUserService.UserId)
                .FirstOrDefaultAsync();

            Task<IList<string>> roles = _userManager.GetRolesAsync(currentUser);
            string roleId = roles.Result.FirstOrDefault();
            currentUser.RoleId = roleId;

            UserDto dtoUser = _mapper.Map(currentUser, new UserDto());

            return Response<UserDto>.Success(dtoUser);
        }

        // update profile
        public async Task<Response<UserDto>> UpdateProfileResponseAsync(
            UpdateProfileRequest request
        )
        {
            ApplicationUser userInDb = await _userManager.FindByIdAsync(
                _currentTenantUserService.UserId
            ); // check current user ID
            if (userInDb == null)
            {
                return Response<UserDto>.Fail("Utilizador não encontrado");
            }

            ApplicationUser userWithEmail = await _userManager.FindByEmailAsync(request.Email); // check email in the request

            if (userWithEmail == userInDb) // set to null if match is the current user
            {
                userWithEmail = null;
            }

            if (userWithEmail != null) // check if email is in use already
            {
                return Response<UserDto>.Fail("O email já está a ser usado");
            }

            ApplicationUser updatedAppUser = _mapper.Map(request, userInDb); // update all fields

            _ = await _userManager.UpdateAsync(updatedAppUser); // save changes to db

            UserDto responseDto = _mapper.Map(updatedAppUser, new UserDto()); // response dto
            responseDto.RoleId = _userManager.GetRolesAsync(updatedAppUser).Result.FirstOrDefault(); // include the role in the dto

            return Response<UserDto>.Success(responseDto);
        }

        // change password
        public async Task<Response<string>> ChangePasswordResponseAsync(
            ChangePasswordRequest request
        )
        {
            ApplicationUser user = await _userManager.FindByIdAsync(
                _currentTenantUserService.UserId
            );
            if (user == null)
            {
                return Response<string>.Fail("Não encontrado");
            }

            IdentityResult result = await _userManager.ChangePasswordAsync(
                user,
                request.Password,
                request.NewPassword
            );
            if (result.Succeeded)
            {
                return Response<string>.Success("Palavra-passe atualizada");
            }
            else
            {
                List<string> errorList = [];
                foreach (IdentityError error in result.Errors)
                {
                    errorList.Add(error.Description);
                }
                return Response<string>.Fail(errorList);
            }
        }

        // change profile image
        public async Task<Response<string>> ChangeProfileImageResponseAsync(
            ImageUploadRequest request
        )
        {
            ApplicationUser userInDb = await _userManager.FindByIdAsync(
                _currentTenantUserService.UserId
            ); // check current user ID
            if (userInDb == null)
            {
                return Response<string>.Fail("Utilizador não encontrado");
            }

            string currentImage = userInDb.ImageUrl ?? "";

            if (request.ImageFile != null)
            {
                string imageResult = await _imageService.AddImage(request.ImageFile, 300, 300); // handle image upload (cloudinary)
                userInDb.ImageUrl = imageResult; // write the external image url to user

                if (currentImage != "")
                {
                    _ = await _imageService.DeleteImage(currentImage); // delete the old image
                }
            }

            if (request.DeleteCurrentImage && currentImage != "")
            {
                _ = await _imageService.DeleteImage(currentImage);
                userInDb.ImageUrl = "";
            }

            _ = await _userManager.UpdateAsync(userInDb);
            return Response<string>.Success(userInDb.ImageUrl);
        }
        #endregion [-- PROFILE --]

        // FORGOT/RESET PASSWORD (anonymous permissions -- tenant ID from header or subdomain)
        #region [-- FORGOT/RESET PASSWORD --]
        // forgot password
        public async Task<Response<string>> ForgotPasswordResponseAsync(
            ForgotPasswordRequest request,
            string origin,
            string route
        )
        {
            ApplicationUser user = await _userManager.FindByEmailAsync(request.Email.Normalize());
            if (user is null || !user.IsActive)
            {
                return Response<string>.Fail("Não encontrado");
            }

            string code = await _userManager.GeneratePasswordResetTokenAsync(user);

            // Create endpoint URI with token as query parameter
            Uri endpointUri = new(
                string.Concat($"{origin}/{route}?token={Uri.EscapeDataString(code)}")
            );

            // HTML email template with better styling
            string emailBody =
                $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='UTF-8'>
                    <title>Redefinição de Palavra-passe</title>
                    <style>
                        body {{
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }}
                        .email-container {{
                            background-color: #ffffff;
                            border-radius: 5px;
                            padding: 20px;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                        }}
                        .header {{
                            text-align: center;
                            padding-bottom: 20px;
                            border-bottom: 2px solid #f0f0f0;
                            margin-bottom: 20px;
                        }}
                        .button {{
                            display: inline-block;
                            padding: 12px 24px;
                            background-color: #007bff;
                            color: #ffffff;
                            text-decoration: none;
                            border-radius: 4px;
                            margin: 20px 0;
                        }}
                        .footer {{
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 1px solid #f0f0f0;
                            font-size: 12px;
                            color: #666666;
                        }}
                    </style>
                </head>
                <body>
                    <div class='email-container'>
                        <div class='header'>
                            <h2>Redefinição de Palavra-passe</h2>
                        </div>
                        
                        <p>Olá,</p>
                        
                        <p>Recebemos um pedido para redefinir a palavra-passe da sua conta. 
                           Para prosseguir com a redefinição, clique no botão abaixo:</p>
                        
                        <div style='text-align: center;'>
                            <a href='{endpointUri}' class='button'>Redefinir Palavra-passe</a>
                        </div>
                        
                        <p>Se não solicitou esta redefinição, pode ignorar este e-mail com segurança.</p>
                        
                        <p>Por razões de segurança, este link expirará em 24 horas.</p>
                        
                        <div class='footer'>
                            <p>Esta é uma mensagem automática, por favor não responda a este e-mail.</p>
                        </div>
                    </div>
                </body>
                </html>";

            MailRequest mailRequest = new()
            {
                To = request.Email,
                Subject = "Redefinição da palavra-passe",
                Body = emailBody,
            };

            await _mailService.SendAsync(mailRequest);

            return Response<string>.Success(
                "A redefinição da palavra-passe foi enviada para o seu e-mail."
            );
        }

        // reset password
        public async Task<Response<string>> ResetPasswordResponseAsync(ResetPasswordRequest request)
        {
            ApplicationUser user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null || !user.IsActive)
            {
                return Response<string>.Fail("Não encontrado");
            }

            IdentityResult result = await _userManager.ResetPasswordAsync(
                user,
                request.Token,
                request.Password
            );
            if (result.Succeeded)
            {
                return Response<string>.Success("Palavra-passe redefinida com sucesso");
            }
            else
            {
                //return result.errors
                return Response<string>.Fail("Falha na reposição da palavra-passe");
            }
        }
        #endregion [-- FORGOT/RESET PASSWORD --]

        #region [-- ADMIN LEVEL PERMISSIONS --]

        // register new user of admin or client role
        public async Task<Response<UserDto>> RegisterAdminOrClientRoleUserResponseAsync(
            RegisterAdminOrClientUserRequest request
        )
        {
            // Check if the user already exists
            ApplicationUser userExist = await _userManager.FindByEmailAsync(request.Email);
            if (userExist != null)
            {
                return Response<UserDto>.Fail("O utilizador já existe");
            }

            // Validate the client ID
            Guid clienteId = Guid.Parse(request.ClienteId);
            ClienteMatchId clienteMatchId = new(clienteId);
            bool clienteExists = await _repository.ExistsAsync<Cliente, Guid>(clienteMatchId);
            if (!clienteExists)
            {
                return Response<UserDto>.Fail("O cliente é inválido");
            }

            // Create a new ApplicationUser instance
            ApplicationUser user = new()
            {
                UserName = $"{request.Email}.{GSLPHelpers.GenerateHex(4)}", // Generate unique username
                FirstName = request.FirstName,
                LastName = request.LastName,
                PhoneNumber = request.PhoneNumber,
                Email = request.Email,
                EmailConfirmed = true,
                IsActive = true,
                ClienteId = clienteId,
            };

            // Create the user with the provided password
            IdentityResult result = await _userManager.CreateAsync(user, request.Password);
            if (result.Succeeded)
            {
                // Add the user to the specified role
                _ = await _userManager.AddToRoleAsync(user, request.RoleId);
                user.RoleId = request.RoleId; // Set the role ID for the response

                // Check if the role is "client" before associating with the license and profile
                if (request.RoleId == "client")
                {
                    // Get perfil
                    Perfil perfil = await GetPerfilByIdAsync(Guid.Parse(request.PerfilId));
                    if (perfil == null)
                    {
                        return Response<UserDto>.Fail("Perfil não encontrado");
                    }

                    // Associate the user with the license (inactive for client role)
                    List<string> licencaErrors =
                        await _licencaUtilizadorService.UpdateLicencaUtilizadorStatusResponseAsync(
                            perfil.LicencaId,
                            user.Id,
                            false // Set to false for client role
                        );

                    if (licencaErrors == null || licencaErrors.Count == 0)
                    {
                        // Associate the user with the profile
                        List<string> perfilErrors =
                            await _perfilUtilizadorService.UpdateUtilizadorWithOnePerfilAsync(
                                perfil.Id,
                                user.Id
                            );

                        if (perfilErrors != null && perfilErrors.Count > 0)
                        {
                            // If profile association fails, remove the license association
                            _ =
                                await _licencaUtilizadorService.RemoveUtilizadorFromLicencaResponseAsync(
                                    perfil.LicencaId,
                                    user.Id
                                );
                        }
                    }
                    else
                    {
                        return Response<UserDto>.Fail(licencaErrors);
                    }
                }
                else if (request.RoleId == "admin" && !string.IsNullOrEmpty(request.LicencaId))
                {
                    // For admin role, associate with license as active
                    List<string> licencaErrors =
                        await _licencaUtilizadorService.UpdateLicencaUtilizadorStatusResponseAsync(
                            Guid.Parse(request.LicencaId),
                            user.Id,
                            true // Set to true for admin role
                        );

                    if (licencaErrors != null && licencaErrors.Count > 0)
                    {
                        return Response<UserDto>.Fail(licencaErrors);
                    }
                }

                UserDto responseDto = _mapper.Map(user, new UserDto());

                return Response<UserDto>.Success(responseDto);
            }
            else
            {
                // Collect error messages from the IdentityResult
                List<string> messages = [];
                foreach (IdentityError error in result.Errors)
                {
                    messages.Add(error.Description);
                }
                return Response<UserDto>.Fail(messages);
            }
        }

        // update new user of admin or client role
        public async Task<Response<UserDto>> UpdateAdminOrClientRoleUserResponseAsync(
            Guid id,
            UpdateAdminOrClientUserRequest request
        )
        {
            // Get the current user's ClienteId
            string currentUserId = _currentTenantUserService.UserId;
            Guid? clienteIdOrNull = await GetUserClienteId(currentUserId);

            if (!clienteIdOrNull.HasValue || clienteIdOrNull.Value.Equals(Guid.Empty))
            {
                return Response<UserDto>.Fail("Utilizador não tem um cliente associado");
            }

            Guid clienteId = clienteIdOrNull.Value;
            ApplicationUser user = await _userManager.FindByIdAsync(id.ToString());

            if (user == null)
            {
                return Response<UserDto>.Fail("Não encontrado");
            }

            // Check if the user's ClienteId matches the provided clienteId
            if (user.ClienteId != clienteId)
            {
                return Response<UserDto>.Fail(
                    "Utilizador não tem permissões para atualizar dados de outro cliente"
                );
            }

            IList<string> roles = await _userManager.GetRolesAsync(user);
            if (roles.FirstOrDefault() == "root") // Prevent editing root user
            {
                return Response<UserDto>.Fail("Não é possível editar o root user");
            }

            if (id == Guid.Parse(_currentTenantUserService.UserId)) // Prevent editing current user
            {
                return Response<UserDto>.Fail("Não é possível atualizar o utilizador atual");
            }

            // Check if email already in use
            if (request.Email != user.Email)
            {
                ApplicationUser userExist = await _userManager.FindByEmailAsync(request.Email);
                if (userExist != null)
                {
                    return Response<UserDto>.Fail("O email já está a ser usado");
                }
            }

            // Map to application user
            ApplicationUser updatedUser = _mapper.Map(request, user);
            IdentityResult result = await _userManager.UpdateAsync(updatedUser); // Save changes

            if (result.Succeeded)
            {
                // Check if the role is being updated
                bool isRoleChanged = request.RoleId != roles.FirstOrDefault();
                if (isRoleChanged)
                {
                    _ = await _userManager.RemoveFromRolesAsync(user, [.. roles]);
                    _ = await _userManager.AddToRoleAsync(user, request.RoleId);

                    // If changing from client to admin role, remove existing profile associations
                    if (roles.FirstOrDefault() == "client" && request.RoleId == "admin")
                    {
                        // Get existing perfis
                        IEnumerable<Application.Services.Platform.PerfilService.DTOs.PerfilDTO> existingPerfis =
                            await _perfilUtilizadorService.GetPerfisByUtilizadorIdAsync(user.Id);

                        if (existingPerfis != null)
                        {
                            // Remove the user from all associated perfis
                            foreach (var perfil in existingPerfis)
                            {
                                _ =
                                    await _perfilUtilizadorService.RemoveUtilizadorFromPerfilResponseAsync(
                                        Guid.Parse(perfil.Id!),
                                        user.Id
                                    );
                            }
                        }
                    }
                }

                // Handle profile association for client role
                if (request.RoleId == "client")
                {
                    // Get perfil
                    Perfil perfil = await GetPerfilByIdAsync(Guid.Parse(request.PerfilId));
                    if (perfil == null)
                    {
                        return Response<UserDto>.Fail("Perfil não encontrado");
                    }

                    // Associate the user with the profile
                    List<string> perfilErrors =
                        await _perfilUtilizadorService.UpdateUtilizadorWithOnePerfilAsync(
                            perfil.Id,
                            user.Id
                        );
                    if (perfilErrors != null && perfilErrors.Count > 0)
                    {
                        return Response<UserDto>.Fail(perfilErrors);
                    }
                }

                UserDto updatedUserDTO = _mapper.Map(updatedUser, new UserDto());
                return Response<UserDto>.Success(updatedUserDTO);
            }
            else
            {
                // Collect error messages from the IdentityResult
                List<string> messages = [];
                foreach (IdentityError error in result.Errors)
                {
                    messages.Add(error.Description);
                }
                return Response<UserDto>.Fail(messages);
            }
        }

        // delete user of admin or client role
        public async Task<Response<Guid>> DeleteAdminOrClientRoleUserResponseAsync(Guid id)
        {
            try
            {
                ApplicationUser user = await _userManager.FindByIdAsync(id.ToString());
                if (user == null)
                {
                    return Response<Guid>.Fail("Utilizador não encontrado");
                }

                if (id == Guid.Parse(_currentTenantUserService.UserId)) // Prevent deleting current user
                {
                    return Response<Guid>.Fail("Não é possível apagar o utilizador atual");
                }

                // // Check if the user has any licenca association
                // bool hasUserAnyLicencaAssociation =
                //     await _licencaUtilizadorService.HasUserAnyLicencaAssociationAsync(user.Id);
                // if (hasUserAnyLicencaAssociation)
                // {
                //     return Response<Guid>.Fail("O utilizador tem licenças associadas");
                // }

                // Retrieve all associated perfis for the user
                IEnumerable<Application.Services.Platform.PerfilService.DTOs.PerfilDTO> existingPerfis =
                    await _perfilUtilizadorService.GetPerfisByUtilizadorIdAsync(user.Id);
                if (existingPerfis != null)
                {
                    // Remove the user from all associated perfis
                    foreach (
                        Application.Services.Platform.PerfilService.DTOs.PerfilDTO perfil in existingPerfis
                    )
                    {
                        _ = await _perfilUtilizadorService.RemoveUtilizadorFromPerfilResponseAsync(
                            Guid.Parse(perfil.Id!),
                            user.Id
                        );
                    }
                }

                // Check for the associated licenca and remove the user from it if necessary
                Licenca licenca = await GetLicencaByUtilizadorIdAsync(user.Id);
                if (licenca != null)
                {
                    // Logic to remove user from licenca or delete it if applicable
                    _ = await _licencaUtilizadorService.RemoveUtilizadorFromLicencaResponseAsync(
                        licenca.Id,
                        user.Id
                    );
                }

                // Delete the user
                IdentityResult result = await _userManager.DeleteAsync(user);

                return !result.Succeeded
                    ? Response<Guid>.Fail(
                        "Erro ao apagar o utilizador: "
                            + string.Join(", ", result.Errors.Select(e => e.Description))
                    )
                    : Response<Guid>.Success(id);
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        // get basic user details, but only retrieve users from the same client, excluding users with administrator roles.
        public async Task<Response<UserDto>> GetBasicUserDetailsResponseAsync(Guid id)
        {
            // Get the current user's ClienteId
            string currentUserId = _currentTenantUserService.UserId;
            Guid? clienteIdOrNull = await GetUserClienteId(currentUserId);

            if (!clienteIdOrNull.HasValue || clienteIdOrNull.Value.Equals(Guid.Empty))
            {
                return Response<UserDto>.Fail("Utilizador não tem um cliente associado");
            }

            Guid clienteId = clienteIdOrNull.Value;

            ApplicationUser user = await _userManager
                .Users.Where(x => x.Id == id.ToString())
                .Include(x => x.Cliente)
                .Include(x => x.PerfisUtilizadores)
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return Response<UserDto>.Fail("O utilizador não existe");
            }

            // Check if the user's ClienteId matches the provided clienteId
            if (user.ClienteId != clienteId)
            {
                return Response<UserDto>.Fail(
                    "Utilizador não tem permissões para aceder a dados de outro cliente"
                );
            }

            Task<IList<string>> roles = _userManager.GetRolesAsync(user);

            string roleId = roles.Result.FirstOrDefault();
            user.RoleId = roleId;

            // Check if the user's RoleId is either 'admin' or 'client'
            if (user.RoleId is not "admin" and not "client")
            {
                return Response<UserDto>.Fail("O utilizador não tem a permissão necessária");
            }

            UserDto responseDto = _mapper.Map(user, new UserDto());

            return Response<UserDto>.Success(responseDto);
        }

        public async Task<Response<IEnumerable<UserDto>>> GetUsersByClienteAndRoleResponseAsync(
            Guid clienteId,
            string roleId = null
        )
        {
            try
            {
                // Validate that clienteId is not Guid.Empty
                if (clienteId == Guid.Empty)
                {
                    return Response<IEnumerable<UserDto>>.Fail(
                        "O ID do cliente não pode estar vazio."
                    );
                }

                // Start with the base query: ordering users by creation date and including Cliente entity
                IQueryable<ApplicationUser> usersQuery = _userManager
                    .Users.Where(x => x.ClienteId == clienteId)
                    .OrderByDescending(x => x.CreatedOn)
                    .Include(x => x.Cliente)
                    .Include(x => x.PerfisUtilizadores)
                    .Include(x => x.LicencasUtilizadores)
                    .ThenInclude(lu => lu.Licenca);

                // Fetch the users list
                List<ApplicationUser> usersList = await usersQuery.ToListAsync();

                // Populate the RoleId for each user
                foreach (ApplicationUser user in usersList)
                {
                    // Get the roles assigned to the user
                    Task<IList<string>> roles = _userManager.GetRolesAsync(user);
                    string roleIdAssigned = roles.Result.FirstOrDefault();
                    user.RoleId = roleIdAssigned; // Assuming RoleId is a non-mapped property
                }

                // Exclude users with "administrator" roleId
                usersList = [.. usersList.Where(user => user.RoleId != "administrator")];

                // If a roleId is provided, filter users by their roleId
                if (!string.IsNullOrEmpty(roleId))
                {
                    usersList = [.. usersList.Where(user => user.RoleId == roleId)];
                }

                // Map ApplicationUser to UserDto
                List<UserDto> dtoList = _mapper.Map<List<UserDto>>(usersList);

                // Return the response with the list of UserDto
                return Response<IEnumerable<UserDto>>.Success(dtoList);
            }
            catch (Exception ex)
            {
                // In case of an error, return a failure response
                return Response<IEnumerable<UserDto>>.Fail(ex.Message);
            }
        }

        public async Task<PaginatedResponse<UserDto>> GetUsersPaginatedResponseAsync(
            UserTableFilter filter
        )
        {
            try
            {
                // Start with base query
                IQueryable<ApplicationUser> usersQuery = _userManager
                    .Users.Include(x => x.Cliente)
                    .Include(x => x.PerfisUtilizadores)
                    .Include(x => x.LicencasUtilizadores)
                    .ThenInclude(lu => lu.Licenca);

                // Apply filters if any
                if (filter.Filters != null && filter.Filters.Count != 0)
                {
                    foreach (TableFilter tableFilter in filter.Filters)
                    {
                        switch (tableFilter.Id.ToLower()) // Add ToLower() for case-insensitive comparison
                        {
                            case "nome":
                                usersQuery = usersQuery.Where(x =>
                                    x.FirstName.Contains(tableFilter.Value)
                                    || x.LastName.Contains(tableFilter.Value)
                                );
                                break;
                            case "email":
                                usersQuery = usersQuery.Where(x =>
                                    x.Email.Contains(tableFilter.Value)
                                );
                                break;
                            case "roleid":
                                if (!string.IsNullOrEmpty(tableFilter.Value))
                                {
                                    var usersInRole = await _userManager.GetUsersInRoleAsync(
                                        tableFilter.Value
                                    );
                                    var userIds = usersInRole.Select(u => u.Id).ToList();
                                    usersQuery = usersQuery.Where(x => userIds.Contains(x.Id));
                                }
                                break;
                            case "ativo":
                                if (bool.TryParse(tableFilter.Value, out bool isActive))
                                {
                                    usersQuery = usersQuery.Where(x => x.IsActive == isActive);
                                }
                                break;
                            case "clienteid":
                                if (Guid.TryParse(tableFilter.Value, out Guid clienteId))
                                {
                                    usersQuery = usersQuery.Where(x => x.ClienteId == clienteId);
                                }
                                break;
                        }
                    }
                }

                // Get all users before pagination for proper sorting
                List<ApplicationUser> allUsers = await usersQuery.ToListAsync();

                // Get roles for all users sequentially to avoid DbContext conflicts
                foreach (ApplicationUser user in allUsers)
                {
                    IList<string> roles = await _userManager.GetRolesAsync(user);
                    user.RoleId = roles.FirstOrDefault() ?? string.Empty;
                }

                // Apply sorting
                string dynamicOrder =
                    (filter.Sorting != null) ? GSLPHelpers.GenerateOrderByString(filter) : "";
                if (string.IsNullOrEmpty(dynamicOrder))
                {
                    allUsers = [.. allUsers.OrderByDescending(x => x.CreatedOn)];
                }
                else
                {
                    string[] orderFields = dynamicOrder.Split(',');
                    bool isFirst = true;

                    foreach (string field in orderFields)
                    {
                        bool isDescending = field.StartsWith('-');
                        string propertyName = isDescending ? field[1..] : field;

                        switch (propertyName.ToLower(CultureInfo.InvariantCulture))
                        {
                            case "nome":
                                allUsers = ApplyInMemoryOrder(
                                    allUsers,
                                    x => x.FirstName + " " + x.LastName,
                                    isDescending,
                                    isFirst
                                );
                                break;
                            case "email":
                                allUsers = ApplyInMemoryOrder(
                                    allUsers,
                                    x => x.Email,
                                    isDescending,
                                    isFirst
                                );
                                break;
                            case "createdon":
                                allUsers = ApplyInMemoryOrder(
                                    allUsers,
                                    x => x.CreatedOn,
                                    isDescending,
                                    isFirst
                                );
                                break;
                            case "roleid":
                                allUsers = ApplyInMemoryOrder(
                                    allUsers,
                                    x => x.RoleId ?? string.Empty,
                                    isDescending,
                                    isFirst
                                );
                                break;
                            case "ativo":
                                allUsers = ApplyInMemoryOrder(
                                    allUsers,
                                    x => x.IsActive,
                                    isDescending,
                                    isFirst
                                );
                                break;
                            case "cliente.nome":
                                allUsers = ApplyInMemoryOrder(
                                    allUsers,
                                    x => x.Cliente?.Nome ?? string.Empty,
                                    isDescending,
                                    isFirst
                                );
                                break;
                            default:
                                break;
                        }
                        isFirst = false;
                    }
                }

                // Apply pagination after sorting
                int totalCount = allUsers.Count;
                List<ApplicationUser> pagedUsers =
                [
                    .. allUsers
                        .Skip((filter.PageNumber - 1) * filter.PageSize)
                        .Take(filter.PageSize),
                ];

                // Map to DTOs
                List<UserDto> dtoList = _mapper.Map<List<UserDto>>(pagedUsers);

                return new PaginatedResponse<UserDto>(
                    dtoList,
                    totalCount,
                    filter.PageNumber,
                    filter.PageSize
                );
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Erro ao obter utilizadores paginados", ex);
            }
        }

        // New helper method for in-memory ordering
        private static List<ApplicationUser> ApplyInMemoryOrder<TKey>(
            List<ApplicationUser> list,
            Func<ApplicationUser, TKey> orderExpression,
            bool isDescending,
            bool isFirst
        )
        {
            if (isFirst)
            {
                return isDescending
                    ? [.. list.OrderByDescending(orderExpression)]
                    : [.. list.OrderBy(orderExpression)];
            }
            else
            {
                IOrderedEnumerable<ApplicationUser> orderedList =
                    list as IOrderedEnumerable<ApplicationUser>;
                return isDescending
                    ? [.. orderedList.ThenByDescending(orderExpression)]
                    : [.. orderedList.ThenBy(orderExpression)];
            }
        }

        public async Task<
            PaginatedResponse<UserDto>
        > GetUsersByClienteAndRolePaginatedResponseAsync(Guid clienteId, UserTableFilter filter)
        {
            try
            {
                // Start with base query
                IQueryable<ApplicationUser> usersQuery = _userManager
                    .Users.Include(x => x.Cliente)
                    .Include(x => x.PerfisUtilizadores)
                    .Include(x => x.LicencasUtilizadores)
                    .ThenInclude(lu => lu.Licenca)
                    .Where(x => x.ClienteId == clienteId);

                // Get all users in role if roleId filter exists
                if (
                    filter.Filters?.Any(f => f.Id == "roleId" && !string.IsNullOrEmpty(f.Value))
                    == true
                )
                {
                    var roleFilter = filter.Filters.First(f => f.Id == "roleId");
                    var usersInRole = await _userManager.GetUsersInRoleAsync(roleFilter.Value);
                    var userIds = usersInRole.Select(u => u.Id).ToList();
                    usersQuery = usersQuery.Where(x => userIds.Contains(x.Id));
                }

                // Apply other filters at database level
                if (filter.Filters != null)
                {
                    foreach (var tableFilter in filter.Filters.Where(f => f.Id != "roleId"))
                    {
                        switch (tableFilter.Id)
                        {
                            case "nome":
                                usersQuery = usersQuery.Where(x =>
                                    x.FirstName.Contains(tableFilter.Value)
                                    || x.LastName.Contains(tableFilter.Value)
                                );
                                break;
                            case "email":
                                usersQuery = usersQuery.Where(x =>
                                    x.Email.Contains(tableFilter.Value)
                                );
                                break;
                            case "ativo":
                                if (bool.TryParse(tableFilter.Value, out bool isActive))
                                {
                                    usersQuery = usersQuery.Where(x => x.IsActive == isActive);
                                }
                                break;
                        }
                    }
                }

                // Filter out administrators
                var administrators = await _userManager.GetUsersInRoleAsync("administrator");
                var adminIds = administrators.Select(a => a.Id).ToList();
                usersQuery = usersQuery.Where(x => !adminIds.Contains(x.Id));

                // Get total count before pagination
                var totalCount = await usersQuery.CountAsync();

                // Apply sorting
                if (filter.Sorting?.Any() == true)
                {
                    var orderByString = GSLPHelpers.GenerateOrderByString(filter);
                    foreach (var orderField in orderByString.Split(','))
                    {
                        var isDescending = orderField.StartsWith('-');
                        var propertyName = isDescending ? orderField[1..] : orderField;

                        switch (propertyName.ToLower())
                        {
                            case "nome":
                                usersQuery = isDescending
                                    ? usersQuery
                                        .OrderByDescending(x => x.FirstName)
                                        .ThenByDescending(x => x.LastName)
                                    : usersQuery.OrderBy(x => x.FirstName).ThenBy(x => x.LastName);
                                break;
                            case "email":
                                usersQuery = isDescending
                                    ? usersQuery.OrderByDescending(x => x.Email)
                                    : usersQuery.OrderBy(x => x.Email);
                                break;
                            case "createdon":
                                usersQuery = isDescending
                                    ? usersQuery.OrderByDescending(x => x.CreatedOn)
                                    : usersQuery.OrderBy(x => x.CreatedOn);
                                break;
                            case "ativo":
                                usersQuery = isDescending
                                    ? usersQuery.OrderByDescending(x => x.IsActive)
                                    : usersQuery.OrderBy(x => x.IsActive);
                                break;
                        }
                    }
                }
                else
                {
                    usersQuery = usersQuery.OrderByDescending(x => x.CreatedOn);
                }

                // Apply pagination
                var pagedUsers = await usersQuery
                    .Skip((filter.PageNumber - 1) * filter.PageSize)
                    .Take(filter.PageSize)
                    .ToListAsync();

                // Get roles for paged users
                foreach (var user in pagedUsers)
                {
                    var roles = await _userManager.GetRolesAsync(user);
                    user.RoleId = roles.FirstOrDefault() ?? string.Empty;
                }

                // Map to DTOs
                var dtoList = _mapper.Map<List<UserDto>>(pagedUsers);

                return new PaginatedResponse<UserDto>(
                    dtoList,
                    totalCount,
                    filter.PageNumber,
                    filter.PageSize
                );
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException(
                    "Erro ao obter utilizadores paginados para o cliente",
                    ex
                );
            }
        }

        public async Task<Response<List<Guid>>> DeleteUsersResponseAsync(List<Guid> ids)
        {
            List<Guid> successfullyDeleted = [];
            List<string> failureMessages = [];

            try
            {
                foreach (Guid id in ids)
                {
                    try
                    {
                        ApplicationUser user = await _userManager.FindByIdAsync(id.ToString());
                        if (user == null)
                        {
                            failureMessages.Add($"Utilizador {id} não encontrado");
                            continue;
                        }

                        Guid currentUserId = Guid.Parse(_currentTenantUserService.UserId);
                        if (id == currentUserId)
                        {
                            failureMessages.Add(
                                $"Não é possível apagar o utilizador {user.FirstName} {user.LastName}"
                            );
                            continue;
                        }

                        // Remove from perfis
                        IEnumerable<Application.Services.Platform.PerfilService.DTOs.PerfilDTO> existingPerfis =
                            await _perfilUtilizadorService.GetPerfisByUtilizadorIdAsync(user.Id);
                        if (existingPerfis != null)
                        {
                            foreach (
                                Application.Services.Platform.PerfilService.DTOs.PerfilDTO perfil in existingPerfis
                            )
                            {
                                _ =
                                    await _perfilUtilizadorService.RemoveUtilizadorFromPerfilResponseAsync(
                                        Guid.Parse(perfil.Id!),
                                        user.Id
                                    );
                            }
                        }

                        // Remove from licenca
                        Licenca licenca = await GetLicencaByUtilizadorIdAsync(user.Id);
                        if (licenca != null)
                        {
                            _ =
                                await _licencaUtilizadorService.RemoveUtilizadorFromLicencaResponseAsync(
                                    licenca.Id,
                                    user.Id
                                );
                        }

                        // Delete the user
                        IdentityResult result = await _userManager.DeleteAsync(user);
                        if (result.Succeeded)
                        {
                            successfullyDeleted.Add(id);
                        }
                        else
                        {
                            failureMessages.Add(
                                $"Erro ao apagar o utilizador {id}: {string.Join(", ", result.Errors.Select(e => e.Description))}"
                            );
                        }
                    }
                    catch (Exception ex)
                    {
                        failureMessages.Add($"Erro ao processar utilizador {id}: {ex.Message}");
                    }
                }

                return failureMessages.Count > 0
                    ? Response<List<Guid>>.Fail(failureMessages)
                    : Response<List<Guid>>.Success(successfullyDeleted);
            }
            catch (Exception ex)
            {
                return Response<List<Guid>>.Fail(ex.Message);
            }
        }

        public async Task<Response<List<Guid>>> DeleteAdminOrClientRoleUsersResponseAsync(
            List<Guid> ids
        )
        {
            List<Guid> successfullyDeleted = [];
            List<string> failureMessages = [];

            try
            {
                foreach (Guid id in ids)
                {
                    try
                    {
                        ApplicationUser user = await _userManager.FindByIdAsync(id.ToString());
                        if (user == null)
                        {
                            failureMessages.Add($"Utilizador {id} não encontrado");
                            continue;
                        }

                        if (id == Guid.Parse(_currentTenantUserService.UserId))
                        {
                            failureMessages.Add($"Não é possível apagar o utilizador atual ({id})");
                            continue;
                        }

                        // Retrieve all associated perfis for the user
                        IEnumerable<Application.Services.Platform.PerfilService.DTOs.PerfilDTO> existingPerfis =
                            await _perfilUtilizadorService.GetPerfisByUtilizadorIdAsync(user.Id);
                        if (existingPerfis != null)
                        {
                            // Remove the user from all associated perfis
                            foreach (
                                Application.Services.Platform.PerfilService.DTOs.PerfilDTO perfil in existingPerfis
                            )
                            {
                                _ =
                                    await _perfilUtilizadorService.RemoveUtilizadorFromPerfilResponseAsync(
                                        Guid.Parse(perfil.Id!),
                                        user.Id
                                    );
                            }
                        }

                        // Check for the associated licenca and remove the user from it if necessary
                        Licenca licenca = await GetLicencaByUtilizadorIdAsync(user.Id);
                        if (licenca != null)
                        {
                            _ =
                                await _licencaUtilizadorService.RemoveUtilizadorFromLicencaResponseAsync(
                                    licenca.Id,
                                    user.Id
                                );
                        }

                        // Delete the user
                        IdentityResult result = await _userManager.DeleteAsync(user);

                        if (result.Succeeded)
                        {
                            successfullyDeleted.Add(id);
                        }
                        else
                        {
                            failureMessages.Add(
                                $"Erro ao apagar o utilizador {id}: {string.Join(", ", result.Errors.Select(e => e.Description))}"
                            );
                        }
                    }
                    catch (Exception ex)
                    {
                        failureMessages.Add($"Erro ao processar utilizador {id}: {ex.Message}");
                    }
                }

                return failureMessages.Count > 0
                    ? Response<List<Guid>>.Fail(failureMessages)
                    : Response<List<Guid>>.Success(successfullyDeleted);
            }
            catch (Exception ex)
            {
                return Response<List<Guid>>.Fail(ex.Message);
            }
        }

        #endregion [-- ADMIN LEVEL PERMISSIONS --]

        private async Task<Guid?> GetUserClienteId(string userId)
        {
            ApplicationUser user = await _userManager
                .Users.Where(x => x.Id == userId)
                .Select(x => new ApplicationUser { ClienteId = x.ClienteId })
                .FirstOrDefaultAsync();

            return user?.ClienteId;
        }
    }
}
