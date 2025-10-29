using System.ComponentModel.DataAnnotations.Schema;
using GSLP.Domain.Entities.Catalog.Application;

namespace GSLP.Domain.Entities.Catalog.Platform
{
    [Table("LicencasModulos", Schema = "Plataforma")]
    public class LicencaModulo
    {
        public Guid LicencaId { get; set; }
        public Licenca Licenca { get; set; }
        public Guid ModuloId { get; set; }
        public Modulo Modulo { get; set; }
    }
}
