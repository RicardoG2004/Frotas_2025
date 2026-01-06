using GSLP.Application.Common.Marker;

namespace GSLP.Application.Services.Platform.PerfilService.DTOs
{
    public class PerfilModulosFuncionalidadesTreeDTO : IDto
    {
        public ICollection<PerfilModuloTreeDTO> Modulos { get; set; } = [];
    }
}
