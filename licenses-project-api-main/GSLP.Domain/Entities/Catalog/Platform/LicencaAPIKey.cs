using System.ComponentModel.DataAnnotations.Schema;
using GSLP.Domain.Entities.Common;

namespace GSLP.Domain.Entities.Catalog.Platform
{
    [Table("LicencasAPIKeys", Schema = "Plataforma")]
    public class LicencaAPIKey : AuditableEntity
    {
        public string APIKey { get; set; }
        public bool Ativo { get; set; }
        public Guid LicencaId { get; set; }
        public Licenca Licenca { get; set; }
    }
}
