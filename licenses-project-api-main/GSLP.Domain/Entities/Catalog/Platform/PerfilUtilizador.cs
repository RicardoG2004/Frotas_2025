using System.ComponentModel.DataAnnotations.Schema;
using GSLP.Domain.Entities.Common;

namespace GSLP.Domain.Entities.Catalog.Platform
{
    [Table("PerfisUtilizadores", Schema = "Plataforma")]
    public class PerfilUtilizador
    {
        public Guid PerfilId { get; set; }
        public Perfil Perfil { get; set; }
        public string UtilizadorId { get; set; }
        public ApplicationUser Utilizador { get; set; }
    }
}
