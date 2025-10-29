using GSLP.Application.Common.Marker;
using GSLP.Application.Services.Application.AplicacaoService.DTOs;
using GSLP.Application.Services.Platform.ClienteService.DTOs;
using GSLP.Application.Services.Platform.LicencaFuncionalidadeService.DTOs;
using GSLP.Application.Services.Platform.LicencaModuloService.DTOs;
using GSLP.Application.Services.Platform.PerfilService.DTOs;

namespace GSLP.Application.Services.Platform.LicencaService.DTOs
{
    public class LicencaDTO : IDto
    {
        public string? Id { get; set; }
        public string? Nome { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }
        public int NumeroUtilizadores { get; set; }
        public bool Ativo { get; set; }
        public bool Bloqueada { get; set; }
        public DateTime? DataBloqueio { get; set; }
        public string? MotivoBloqueio { get; set; }
        public string? AplicacaoId { get; set; }
        public AplicacaoDTO Aplicacao { get; set; }
        public string? ClienteId { get; set; }
        public ClienteBasicDTO Cliente { get; set; }
        public ICollection<LicencaModuloDTO> LicencasModulos { get; set; } = [];
        public ICollection<LicencaFuncionalidadeDTO> LicencasFuncionalidades { get; set; } = [];
        public ICollection<PerfilBasicDTO> Perfis { get; set; } = [];
        public DateTime CreatedOn { get; set; }
        public string? APIKey { get; set; }
    }
}
