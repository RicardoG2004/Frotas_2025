using GSLP.Application.Common.Marker;
using GSLP.Application.Services.Platform.PerfilFuncionalidadeService.DTOs;

namespace GSLP.Application.Services.Platform.PerfilService.DTOs
{
    public class PerfilModuloTreeDTO : IDto
    {
        public string? ModuloId { get; set; }
        public string? ModuloNome { get; set; }
        public ICollection<PerfilFuncionalidadeTreeDTO> Funcionalidades { get; set; } = [];
        public int Estado { get; set; }
    }
}
