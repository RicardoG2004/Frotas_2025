using GSLP.Application.Common.Marker;
using GSLP.Application.Services.Application.AplicacaoService.DTOs;
using GSLP.Domain.Enums;

namespace GSLP.Application.Services.Application.AppUpdateService.DTOs
{
    public class AppUpdateDTO : IDto
    {
        public string? Id { get; set; }
        public string? Versao { get; set; }
        public string? Descricao { get; set; }
        
        // Legacy single file fields (used when TipoUpdate is API or Frontend)
        public string? FicheiroUpdate { get; set; }
        public long TamanhoFicheiro { get; set; }
        public string? HashFicheiro { get; set; }
        
        // API-specific file fields (used when TipoUpdate is Both)
        public string? FicheiroUpdateApi { get; set; }
        public long TamanhoFicheiroApi { get; set; }
        public string? HashFicheiroApi { get; set; }
        
        // Frontend-specific file fields (used when TipoUpdate is Both)
        public string? FicheiroUpdateFrontend { get; set; }
        public long TamanhoFicheiroFrontend { get; set; }
        public string? HashFicheiroFrontend { get; set; }
        
        public DateTime DataLancamento { get; set; }
        public bool Ativo { get; set; }
        public bool Obrigatorio { get; set; }
        public string? VersaoMinima { get; set; }
        public UpdateType TipoUpdate { get; set; }
        public string? AplicacaoId { get; set; }
        public AplicacaoDTO Aplicacao { get; set; }
        public string? NotasAtualizacao { get; set; }
        public List<string>? ClienteIds { get; set; } // If null or empty, update is available to all clients
        public DateTime CreatedOn { get; set; }
    }
}

