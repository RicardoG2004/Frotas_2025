using System.ComponentModel.DataAnnotations.Schema;
using GSLP.Domain.Entities.Common;

namespace GSLP.Domain.Entities.Catalog.Application
{
    [Table("Areas", Schema = "Aplicacao")]
    public class Area : AuditableEntity
    {
        public string Nome { get; set; }
        public string Color { get; set; }
        public ICollection<Aplicacao> Aplicacoes { get; set; } = [];
    }
}
