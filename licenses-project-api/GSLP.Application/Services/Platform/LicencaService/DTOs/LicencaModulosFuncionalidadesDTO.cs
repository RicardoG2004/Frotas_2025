using GSLP.Application.Common.Marker;
using GSLP.Application.Services.Platform.LicencaFuncionalidadeService.DTOs;
using GSLP.Application.Services.Platform.LicencaModuloService.DTOs;

namespace GSLP.Application.Services.Platform.LicencaService.DTOs
{
    public class LicencaModulosFuncionalidadesDTO : IDto
    {
        public ICollection<LicencaModuloNomeDTO> Modulos { get; set; } = [];
        public ICollection<LicencaFuncionalidadeNomeDTO> Funcionalidades { get; set; } = [];
    }
}
