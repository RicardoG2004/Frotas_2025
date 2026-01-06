using System.ComponentModel.DataAnnotations.Schema;
using GSLP.Domain.Entities.Catalog.Platform;
using GSLP.Domain.Entities.Common;

namespace GSLP.Domain.Entities.Catalog.Application
{
    [Table("Modulos", Schema = "Aplicacao")]
    public class Modulo : AuditableEntity
    {
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public bool Ativo { get; set; }
        public Guid AplicacaoId { get; set; }
        public Aplicacao Aplicacao { get; set; }
        public ICollection<Funcionalidade> Funcionalidades { get; set; } = [];
        public ICollection<LicencaModulo> LicencasModulos { get; set; } = [];
    }
}
