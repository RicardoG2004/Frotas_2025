using System.ComponentModel.DataAnnotations.Schema;
using GSLP.Domain.Entities.Common;

namespace GSLP.Domain.Entities.Catalog.Platform
{
    [Table("Clientes", Schema = "Plataforma")]
    public class Cliente : AuditableEntity
    {
        public string Nome { get; set; }
        public bool Ativo { get; set; }
        public string Sigla { get; set; }
        public string NIF { get; set; }
        public bool DadosExternos { get; set; }
        public string DadosUrl { get; set; }
        public ICollection<ApplicationUser> Utilizadores { get; set; } = [];
        public ICollection<Licenca> Licencas { get; set; } = [];
    }
}
