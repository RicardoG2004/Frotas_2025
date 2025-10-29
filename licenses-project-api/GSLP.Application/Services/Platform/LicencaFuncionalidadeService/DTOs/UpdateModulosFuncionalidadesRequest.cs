using GSLP.Application.Common.Marker;

namespace GSLP.Application.Services.Platform.LicencaFuncionalidadeService.DTOs
{
    public class UpdateModulosFuncionalidadesRequest : IDto
    {
        public string? FuncionalidadeId { get; set; }
        public string? ModuloId { get; set; }
    }
}
