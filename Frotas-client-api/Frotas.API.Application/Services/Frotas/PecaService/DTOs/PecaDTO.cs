using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Services.Base.TaxaIvaService.DTOs;

namespace Frotas.API.Application.Services.Frotas.PecaService.DTOs
{
  public class PecaDTO : IDto
  {
    public Guid Id { get; set; }
    public string? Designacao { get; set; }
    public int Anos { get; set; }
    public int Kms { get; set; }
    public string? Tipo { get; set; }
    public Guid? TaxaIvaId { get; set; }
    public TaxaIvaDTO? TaxaIva { get; set; }
    public decimal Custo { get; set; }
    public decimal CustoTotal { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}

