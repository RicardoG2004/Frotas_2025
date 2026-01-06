using FluentValidation;
using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.AbastecimentoService.DTOs
{
  public class CreateAbastecimentoRequest : IDto
  {
    public required DateTime Data { get; set; }
    public required Guid FuncionarioId { get; set; }
    public required Guid ViaturaId { get; set; }
    public Guid? CombustivelId { get; set; }
    public decimal? Kms { get; set; }
    public decimal? Litros { get; set; }
    public decimal? Valor { get; set; }
  }

  public class CreateAbastecimentoValidator : AbstractValidator<CreateAbastecimentoRequest>
  {
    public CreateAbastecimentoValidator()
    {
      _ = RuleFor(x => x.FuncionarioId).NotEmpty();
      _ = RuleFor(x => x.ViaturaId).NotEmpty();
      _ = RuleFor(x => x.Data).NotEmpty();
    }
  }
}

