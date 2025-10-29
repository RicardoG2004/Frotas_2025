using System.ComponentModel.DataAnnotations.Schema;
using GSLP.Domain.Entities.Catalog.Platform;
using GSLP.Domain.Entities.Common;

namespace GSLP.Domain.Entities.Catalog.Application
{
    [Table("Funcionalidades", Schema = "Aplicacao")]
    public class Funcionalidade : AuditableEntity
    {
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public bool Ativo { get; set; }
        public Guid ModuloId { get; set; }
        public Modulo Modulo { get; set; }
        public ICollection<LicencaFuncionalidade> LicencasFuncionalidades { get; set; } = [];
        public ICollection<PerfilFuncionalidade> PerfisFuncionalidades { get; set; } = [];
    }
}
