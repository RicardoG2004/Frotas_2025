using System;
using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Base;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Frotas;

[Table("ViaturaAcidente", Schema = "Frotas")]
public class ViaturaAcidente : AuditableEntity
{
  public Guid ViaturaId { get; set; }
  public Viatura Viatura { get; set; }

  public Guid FuncionarioId { get; set; }
  public Funcionario Funcionario { get; set; }

  public DateTime DataHora { get; set; }
  public string? Hora { get; set; }
  public bool Culpa { get; set; }
  public string? DescricaoAcidente { get; set; }
  public string? DescricaoDanos { get; set; }
  public string Local { get; set; }
  public Guid? ConcelhoId { get; set; }
  public Concelho? Concelho { get; set; }
  public Guid? FreguesiaId { get; set; }
  public Freguesia? Freguesia { get; set; }
  public Guid? CodigoPostalId { get; set; }
  public CodigoPostal? CodigoPostal { get; set; }
  public string? LocalReparacao { get; set; }
}

