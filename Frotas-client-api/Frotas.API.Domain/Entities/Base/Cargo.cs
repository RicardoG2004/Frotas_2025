using Frotas.API.Domain.Entities.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace Frotas.API.Domain.Entities.Base
{
    [Table("Cargo", Schema = "Base")]
    public class Cargo : AuditableEntity
    {
        public string Designacao { get; set; }
    }
}