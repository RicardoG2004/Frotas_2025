using GSLP.Application.Common.Identity.DTOs;

namespace GSLP.Application.Services.Platform.LicencaUtilizadorService.DTOs
{
    public class LicencaUtilizadorDTO
    {
        public UserDto Utilizador { get; set; }
        public bool Ativo { get; set; }
    }
}
