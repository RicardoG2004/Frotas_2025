using System;
using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Frotas;

[Table("ViaturaInspecao", Schema = "Frotas")]
public class ViaturaInspecao : AuditableEntity
{
  public Guid ViaturaId { get; set; }
  public Viatura Viatura { get; set; }

  public DateTime DataInspecao { get; set; }
  public string Resultado { get; set; }
  public DateTime DataProximaInspecao { get; set; }
  // Campo para armazenar documentos anexados a esta inspeção (JSON com array de documentos)
  // Porquê: Permite anexar documentos específicos de cada inspeção (certificados, relatórios, etc.)
  public string? Documentos { get; set; }
}


