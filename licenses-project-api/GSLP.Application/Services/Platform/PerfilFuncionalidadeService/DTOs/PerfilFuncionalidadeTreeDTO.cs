using GSLP.Application.Common.Marker;

namespace GSLP.Application.Services.Platform.PerfilFuncionalidadeService.DTOs
{
    public class PerfilFuncionalidadeTreeDTO : IDto
    {
        public string? FuncionalidadeId { get; set; }
        public string? FuncionalidadeNome { get; set; }
        public int Estado { get; set; }
        public bool AuthVer { get; set; }
        public bool AuthAdd { get; set; }
        public bool AuthChg { get; set; }
        public bool AuthDel { get; set; }
        public bool AuthPrt { get; set; }
    }
}
