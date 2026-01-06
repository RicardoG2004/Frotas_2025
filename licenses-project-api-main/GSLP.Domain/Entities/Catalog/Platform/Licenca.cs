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
    public string? VersaoInstalada { get; set; } // Current installed version of the application for this license
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
