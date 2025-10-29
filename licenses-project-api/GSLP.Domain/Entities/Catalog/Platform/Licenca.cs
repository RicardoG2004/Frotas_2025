using System.ComponentModel.DataAnnotations.Schema;
using GSLP.Domain.Entities.Catalog.Application;
using GSLP.Domain.Entities.Common;

namespace GSLP.Domain.Entities.Catalog.Platform
{
    [Table("Licencas", Schema = "Plataforma")]
    public class Licenca : AuditableEntity
    {
        public string Nome { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }
        public int NumeroUtilizadores { get; set; }
        public bool Ativo { get; set; }
        public bool Bloqueada { get; set; }
        public DateTime? DataBloqueio { get; set; }
        public string MotivoBloqueio { get; set; }
        public Guid AplicacaoId { get; set; }
        public Aplicacao Aplicacao { get; set; }
        public Guid ClienteId { get; set; }
        public Cliente Cliente { get; set; }
        public ICollection<LicencaUtilizador> LicencasUtilizadores { get; set; } = [];
        public ICollection<LicencaModulo> LicencasModulos { get; set; } = [];
        public ICollection<LicencaFuncionalidade> LicencasFuncionalidades { get; set; } = [];
        public ICollection<Perfil> Perfis { get; set; } = [];
        public Guid LicencaAPIKeyId { get; set; }
        public LicencaAPIKey LicencaAPIKey { get; set; }
    }
}
