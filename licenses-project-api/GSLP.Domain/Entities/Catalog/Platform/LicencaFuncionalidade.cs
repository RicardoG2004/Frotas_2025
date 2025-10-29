using System.ComponentModel.DataAnnotations.Schema;
using GSLP.Domain.Entities.Catalog.Application;

namespace GSLP.Domain.Entities.Catalog.Platform
{
    [Table("LicencasFuncionalidades", Schema = "Plataforma")]
    public class LicencaFuncionalidade
    {
        public Guid LicencaId { get; set; }
        public Licenca Licenca { get; set; }
        public Guid FuncionalidadeId { get; set; }
        public Funcionalidade Funcionalidade { get; set; }
    }
}
