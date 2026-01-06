using GSLP.Application.Common.Marker;
using GSLP.Application.Services.Application.AreaService.DTOs;
using GSLP.Application.Services.Application.ModuloService.DTOs;

namespace GSLP.Application.Services.Application.AplicacaoService.DTOs
{
    public class AplicacaoDTO : IDto
    {
        public string? Id { get; set; }
        public string? Nome { get; set; }
        public string? Descricao { get; set; }
        public string? Versao { get; set; }
        public bool? Ativo { get; set; }
        public DateTime CreatedOn { get; set; }
        public ICollection<ModuloDTO> Modulos { get; set; } = [];
        public string? AreaId { get; set; }
        public AreaDTO Area { get; set; }
    }
}
