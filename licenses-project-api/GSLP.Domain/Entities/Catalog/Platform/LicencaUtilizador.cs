using System.ComponentModel.DataAnnotations.Schema;
using GSLP.Domain.Entities.Common;

namespace GSLP.Domain.Entities.Catalog.Platform
{
    [Table("LicencasUtilizadores", Schema = "Plataforma")]
    public class LicencaUtilizador
    {
        public Guid LicencaId { get; set; }
        public Licenca Licenca { get; set; }
        public string UtilizadorId { get; set; }
        public ApplicationUser Utilizador { get; set; }
        public bool Ativo { get; set; }
    }
}
