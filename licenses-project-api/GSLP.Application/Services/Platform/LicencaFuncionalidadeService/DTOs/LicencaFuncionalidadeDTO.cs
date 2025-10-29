using GSLP.Application.Common.Marker;

namespace GSLP.Application.Services.Platform.LicencaFuncionalidadeService.DTOs
{
    public class LicencaFuncionalidadeDTO : IDto
    {
        public string? LicencaId { get; set; }
        public string? FuncionalidadeId { get; set; }
    }
}
