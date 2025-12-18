using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Base;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Frotas
{
  [Table("Utilizacao", Schema = "Frotas")]
  public class Utilizacao : AuditableEntity
  {
    public DateTime DataUtilizacao { get; set; }
    public DateTime? DataUltimaConferencia { get; set; }
    public Guid FuncionarioId { get; set; }
    public Funcionario Funcionario { get; set; }
    public Guid? ViaturaId { get; set; }
    public Viatura? Viatura { get; set; }
    public string? HoraInicio { get; set; }
    public string? HoraFim { get; set; }
    public string? Causa { get; set; }
    public string? Observacoes { get; set; }
  }
}

