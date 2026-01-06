using GSLP.Application.Common.Marker;
using GSLP.Application.Services.Application.ModuloService.DTOs;

namespace GSLP.Application.Services.Application.FuncionalidadeService.DTOs
{
    public class FuncionalidadeDTO : IDto
    {
        public string? Id { get; set; }
        public string? Nome { get; set; }
        public string? Descricao { get; set; }
        public bool? Ativo { get; set; }
        public string? ModuloId { get; set; }
        public DateTime CreatedOn { get; set; }
        public ModuloDTO Modulo { get; set; }
    }
}
