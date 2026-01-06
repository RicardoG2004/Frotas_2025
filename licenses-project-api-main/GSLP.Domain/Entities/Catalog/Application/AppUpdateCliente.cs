using System.ComponentModel.DataAnnotations.Schema;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Domain.Entities.Catalog.Application
{
  [Table("AppUpdatesClientes", Schema = "Aplicacao")]
  public class AppUpdateCliente
  {
    public Guid AppUpdateId { get; set; }
    public AppUpdate AppUpdate { get; set; }
    public Guid ClienteId { get; set; }
    public Cliente Cliente { get; set; }
  }
}
