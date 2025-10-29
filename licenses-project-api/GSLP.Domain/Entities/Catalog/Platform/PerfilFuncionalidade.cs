using System.ComponentModel.DataAnnotations.Schema;
using GSLP.Domain.Entities.Catalog.Application;

namespace GSLP.Domain.Entities.Catalog.Platform
{
    [Table("PerfisFuncionalidades", Schema = "Plataforma")]
    public class PerfilFuncionalidade
    {
        public bool AuthVer { get; set; } = true;
        public bool AuthAdd { get; set; } = true;
        public bool AuthChg { get; set; } = true;
        public bool AuthDel { get; set; } = true;
        public bool AuthPrt { get; set; } = true;
        public Guid PerfilId { get; set; }
        public Perfil Perfil { get; set; }
        public Guid FuncionalidadeId { get; set; }
        public Funcionalidade Funcionalidade { get; set; }
    }
}
