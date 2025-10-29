using System.ComponentModel.DataAnnotations.Schema;
using GSLP.Domain.Entities.Common;

namespace GSLP.Domain.Entities.Catalog.Platform
{
    [Table("Perfis", Schema = "Plataforma")]
    public class Perfil : AuditableEntity
    {
        public string Nome { get; set; }
        public bool Ativo { get; set; }
        public Guid LicencaId { get; set; }
        public Licenca Licenca { get; set; }
        public ICollection<PerfilFuncionalidade> PerfisFuncionalidades { get; set; } = [];
        public ICollection<PerfilUtilizador> PerfisUtilizadores { get; set; } = [];
    }
}
