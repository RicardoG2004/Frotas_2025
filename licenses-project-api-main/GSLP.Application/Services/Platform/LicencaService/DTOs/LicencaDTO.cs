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
        public string? VersaoInstalada { get; set; } // Current installed version
        public string? FrontendPath { get; set; } // Path to frontend application
        public string? ApiPath { get; set; } // Path to API application
        public string? ApiPoolName { get; set; } // IIS Application Pool name for API
        public string? FrontendPoolName { get; set; } // IIS Application Pool name for Client/Frontend
        public string? Url1 { get; set; }
        public string? Url2 { get; set; }
        public string? Url3 { get; set; }
        public string? Url4 { get; set; }
        public string? Url5 { get; set; }
        public string? Url6 { get; set; }
        public string? Url7 { get; set; }
        public string? Url8 { get; set; }
        public bool? UseOwnUpdater { get; set; }
    }
}
