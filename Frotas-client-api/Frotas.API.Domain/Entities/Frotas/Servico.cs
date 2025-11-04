using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Base;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Frotas
{
  [Table("Servico", Schema = "Frotas")]
  public class Servico : AuditableEntity
  {
    public string Designacao { get; set; }
    public int Anos { get; set; }
    public int Kms { get; set; }
    public string Tipo { get; set; }
    public Guid? TaxaIvaId { get; set; }
    public TaxaIva TaxaIva { get; set; }
    public decimal Custo { get; set; }
    public decimal CustoTotal { get; set; }
  }
}

