using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Base;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Frotas
{
  [Table("ReservaOficina", Schema = "Frotas")]
  public class ReservaOficina : AuditableEntity
  {
    public DateTime DataReserva { get; set; }
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

