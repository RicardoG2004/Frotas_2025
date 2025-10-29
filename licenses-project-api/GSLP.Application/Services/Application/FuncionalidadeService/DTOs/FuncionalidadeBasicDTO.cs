using GSLP.Application.Common.Marker;

namespace GSLP.Application.Services.Application.FuncionalidadeService.DTOs
{
    public class FuncionalidadeBasicDTO : IDto
    {
        public string? Id { get; set; }
        public string? Nome { get; set; }
        public bool? Ativo { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
