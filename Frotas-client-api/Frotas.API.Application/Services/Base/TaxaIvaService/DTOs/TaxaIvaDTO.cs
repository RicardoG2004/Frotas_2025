using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Base.TaxaIvaService.DTOs
{
    public class TaxaIvaDTO : IDto
    {
        public Guid Id { get; set;}
        public string? Descricao { get; set; }
        public decimal Valor { get; set; }
        public bool Ativo { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}