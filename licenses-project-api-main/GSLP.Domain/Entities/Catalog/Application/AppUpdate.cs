using System.ComponentModel.DataAnnotations.Schema;
using GSLP.Domain.Entities.Common;
using GSLP.Domain.Enums;

namespace GSLP.Domain.Entities.Catalog.Application
{
  [Table("AppUpdates", Schema = "Aplicacao")]
  public class AppUpdate : AuditableEntity
  {
    public string Versao { get; set; }
    public string Descricao { get; set; }
    
    // Legacy single file fields (used when TipoUpdate is API or Frontend)
    public string FicheiroUpdate { get; set; } // Path to the update package (zip file)
    public long TamanhoFicheiro { get; set; } // File size in bytes
    public string HashFicheiro { get; set; } // SHA256 hash for integrity verification
    
    // API-specific file fields (used when TipoUpdate is Both)
    public string FicheiroUpdateApi { get; set; }
    public long TamanhoFicheiroApi { get; set; }
    public string HashFicheiroApi { get; set; }
    
    // Frontend-specific file fields (used when TipoUpdate is Both)
    public string FicheiroUpdateFrontend { get; set; }
    public long TamanhoFicheiroFrontend { get; set; }
    public string HashFicheiroFrontend { get; set; }
    
    public DateTime DataLancamento { get; set; }
    public bool Ativo { get; set; }
    public bool Obrigatorio { get; set; } // Whether update is mandatory
    public string VersaoMinima { get; set; } // Minimum version required to apply this update
    public UpdateType TipoUpdate { get; set; } // Type of update: API, Frontend, or Both
    public Guid AplicacaoId { get; set; }
    public Aplicacao Aplicacao { get; set; }
    public string NotasAtualizacao { get; set; } // Release notes
    public ICollection<AppUpdateCliente> AppUpdatesClientes { get; set; } = [];
  }
}
