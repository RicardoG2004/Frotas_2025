using GSLP.Application.Common.Identity.DTOs;
using GSLP.Application.Common.Identity.Filters;
using GSLP.Application.Common.Images;
using GSLP.Application.Common.Marker;
using GSLP.Application.Common.Wrapper;

namespace GSLP.Application.Common.Identity
{
    public interface IIdentityService : ITransientService
    {
        Task<Response<IEnumerable<UserDto>>> GetUsersResponseAsync(Guid? clienteId); // get user list (full list for client-side pagination)
        Task<Response<UserDto>> GetUserDetailsResponseAsync(Guid id); // get user details
        Task<Response<UserDto>> RegisterUserResponseAsync(RegisterUserRequest request); // register new user
        Task<Response<UserDto>> UpdateUserResponseAsync(UpdateUserRequest request, Guid id); // update user
        Task<Response<Guid>> DeleteUserResponseAsync(Guid id); // delete user
        Task<Response<List<Guid>>> DeleteUsersResponseAsync(List<Guid> ids); // delete users
        Task<Response<UserDto>> GetProfileDetailsResponseAsync(); // get profile
        Task<Response<UserDto>> UpdateProfileResponseAsync(UpdateProfileRequest request); // update profile
        Task<Response<string>> ChangeProfileImageResponseAsync(ImageUploadRequest request); // change profile image
        Task<Response<string>> ChangePasswordResponseAsync(ChangePasswordRequest request); // change password
        Task<Response<string>> ForgotPasswordResponseAsync(
            ForgotPasswordRequest request,
            string origin,
            string route
        ); // forgot password
        Task<Response<string>> ResetPasswordResponseAsync(ResetPasswordRequest request); // reset password

        Task<Response<UserDto>> RegisterAdminOrClientRoleUserResponseAsync(
            RegisterAdminOrClientUserRequest request
        ); // register new user of admin or client role
        Task<Response<UserDto>> UpdateAdminOrClientRoleUserResponseAsync(
            Guid id,
            UpdateAdminOrClientUserRequest request
        ); // update new user of admin or client role
        Task<Response<Guid>> DeleteAdminOrClientRoleUserResponseAsync(Guid id); // delete user of admin or client role
        Task<Response<List<Guid>>> DeleteAdminOrClientRoleUsersResponseAsync(List<Guid> ids); // delete users of admin or client role
        Task<Response<IEnumerable<UserDto>>> GetUsersByClienteAndRoleResponseAsync(
            Guid clienteId,
            string? roleId = null
        );
        Task<Response<UserDto>> GetBasicUserDetailsResponseAsync(Guid id);
        Task<PaginatedResponse<UserDto>> GetUsersPaginatedResponseAsync(UserTableFilter filter);
        Task<PaginatedResponse<UserDto>> GetUsersByClienteAndRolePaginatedResponseAsync(
            Guid clienteId,
            UserTableFilter filter
        );
    }
}
