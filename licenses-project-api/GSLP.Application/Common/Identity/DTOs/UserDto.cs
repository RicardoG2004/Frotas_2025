using GSLP.Application.Common.Marker;
using GSLP.Application.Services.Platform.ClienteService.DTOs;

namespace GSLP.Application.Common.Identity.DTOs
{
    public class UserDto : IDto
    {
        public string Id { get; set; }
        public string ImageUrl { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
        public string PhoneNumber { get; set; }
        public string RoleId { get; set; }
        public string ClienteId { get; set; }
        public ClienteBasicDTO Cliente { get; set; }
        public ICollection<string> PerfisUtilizador { get; set; } = [];
        public DateTime CreatedOn { get; set; }
        public string LicencaId { get; set; }
    }
}
