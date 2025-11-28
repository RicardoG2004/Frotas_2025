using Frotas.API.Domain.Entities.Base;
using Frotas.API.Domain.Entities.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace Frotas.API.Domain.Entities.Frotas
{
  // Enum que define as categorias de inspeção possíveis
  // Cada categoria tem regras diferentes de quando fazer a primeira inspeção e frequência
  public enum CategoriaInspecao
  {
    Ligeiro = 0,              // Carros normais: 1ª inspeção aos 4 anos, depois bienal até 8 anos, depois anual
    LigeiroMercadorias = 1,    // Furgões/comerciais: 1ª inspeção aos 2 anos, depois sempre anual
    Pesado = 2                 // Camiões/autocarros: 1ª inspeção ao 1º ano, depois sempre anual
  }

  [Table("TipoViatura", Schema = "Frotas")]
  public class TipoViatura : AuditableEntity
  {
    public string Designacao { get; set; }
  }
}