using GSLP.Application.Common.Identity.DTOs;
using GSLP.Application.Services.Platform.PerfilService.DTOs;

namespace GSLP.Application.Services.Platform.LicencaService.DTOs
{
    public class PerfilWithUtilizadoresDTO : PerfilBasicDTO
    {
        public ICollection<UserDto> Utilizadores { get; set; } = [];
    }

    public class LicencaPerfilUtilizadoresDTO
    {
        public ICollection<PerfilWithUtilizadoresDTO> Perfis { get; set; } = [];
    }
}
