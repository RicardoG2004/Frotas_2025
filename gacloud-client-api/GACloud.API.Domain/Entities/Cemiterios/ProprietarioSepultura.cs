using System.ComponentModel.DataAnnotations.Schema;
using GACloud.API.Domain.Entities.Common;

namespace GACloud.API.Domain.Entities.Cemiterios
{
  [Table("ProprietarioSepultura", Schema = "Cemiterios")]
  public class ProprietarioSepultura : AuditableEntity
  {
    public Guid ProprietarioId { get; set; }
    public Proprietario Proprietario { get; set; }
    public Guid SepulturaId { get; set; }
    public Sepultura Sepultura { get; set; }
    public DateTime Data { get; set; }
    public bool Ativo { get; set; }
    public bool IsProprietario { get; set; }
    public bool IsResponsavel { get; set; }
    public bool IsResponsavelGuiaReceita { get; set; }
    public DateTime? DataInativacao { get; set; }
    public string Fracao { get; set; }
    public bool Historico { get; set; }
    public string? Observacoes { get; set; }
  }
}
