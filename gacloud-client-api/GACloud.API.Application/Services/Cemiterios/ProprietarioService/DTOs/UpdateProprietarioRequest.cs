using FluentValidation;
using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Cemiterios.ProprietarioService.DTOs
{
  public class UpdateProprietarioRequest : IDto
  {
    public required Guid CemiterioId { get; set; }
    public required Guid EntidadeId { get; set; }
    public List<UpdateProprietarioSepulturaRequest>? Sepulturas { get; set; }
  }

  public class UpdateProprietarioValidator
    : AbstractValidator<UpdateProprietarioRequest>
  {
    public UpdateProprietarioValidator()
    {
      _ = RuleFor(x => x.CemiterioId).NotEmpty();
      _ = RuleFor(x => x.EntidadeId).NotEmpty();
    }
  }
}

