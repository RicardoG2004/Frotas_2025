using FluentValidation;
using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Cemiterios.ProprietarioService.DTOs
{
  public class CreateProprietarioRequest : IDto
  {
    public required Guid CemiterioId { get; set; }
    public required Guid EntidadeId { get; set; }
    public List<CreateProprietarioSepulturaRequest>? Sepulturas { get; set; }
  }

  public class CreateProprietarioValidator
    : AbstractValidator<CreateProprietarioRequest>
  {
    public CreateProprietarioValidator()
    {
      _ = RuleFor(x => x.CemiterioId).NotEmpty();
      _ = RuleFor(x => x.EntidadeId).NotEmpty();
    }
  }
}

