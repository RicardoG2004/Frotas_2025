using GSLP.Application.Common.Marker;
using GSLP.Application.Services.Platform.ClienteService.DTOs;

namespace GSLP.Application.Services.Platform.LicencaUtilizadorService.DTOs
{
    public class LicencaUtilizadorDTOFlat : IDto
    {
        public Guid Id { get; set; }
        public string ImageUrl { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
        public string PhoneNumber { get; set; }
        public string? RoleId { get; set; }
        public string? ClienteId { get; set; }
        public ClienteDTO Cliente { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
