using System;
using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Base;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Frotas;

[Table("ViaturaMulta", Schema = "Frotas")]
public class ViaturaMulta : AuditableEntity
{
  public Guid ViaturaId { get; set; }
  public Viatura Viatura { get; set; }

  public Guid FuncionarioId { get; set; }
  public Funcionario Funcionario { get; set; }

  public DateTime DataHora { get; set; }
  public string? Hora { get; set; }
  public string Local { get; set; }
  public string Motivo { get; set; }
  public decimal Valor { get; set; }
}

