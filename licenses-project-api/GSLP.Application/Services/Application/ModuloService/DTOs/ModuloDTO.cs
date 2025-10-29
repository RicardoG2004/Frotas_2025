using GSLP.Application.Common.Marker;
using GSLP.Application.Services.Application.AplicacaoService.DTOs;
using GSLP.Application.Services.Application.FuncionalidadeService.DTOs;

namespace GSLP.Application.Services.Application.ModuloService.DTOs
{
    public class ModuloDTO : IDto
    {
        public string? Id { get; set; }
        public string? Nome { get; set; }
        public string? Descricao { get; set; }
        public bool? Ativo { get; set; }
        public string? AplicacaoId { get; set; }
        public DateTime CreatedOn { get; set; }
        public ICollection<FuncionalidadeDTO> Funcionalidades { get; set; } = [];
        public AplicacaoDTO Aplicacao { get; set; }
    }
}
