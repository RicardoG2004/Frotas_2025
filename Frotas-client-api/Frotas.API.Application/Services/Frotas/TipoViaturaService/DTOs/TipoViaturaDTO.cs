using Frotas.API.Application.Common.Marker;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.TipoViaturaService.DTOs
{
  public class TipoViaturaDTO : IDto
  {
    public Guid Id { get; set; }
    public string Designacao { get; set; }
    // Propriedade necessária para retornar a categoria quando consultamos um tipo de viatura
    // Permite que o frontend saiba qual categoria está associada
    public CategoriaInspecao CategoriaInspecao { get; set; }
  }
}