using GSLP.Application.Common.Marker;

namespace GSLP.Application.Services.Platform.LicencaFuncionalidadeService.DTOs
{
    public class LicencaFuncionalidadeNomeDTO : IDto
    {
        public string? Id { get; set; }
        public string? Nome { get; set; }
        public string? ModuloId { get; set; }
    }
}
