using FluentValidation;
using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Utility;

namespace GACloud.API.Application.Services.Base.RubricaService.DTOs
{
  public class UpdateRubricaRequest : IDto
  {
    public required string Codigo { get; set; }
    public required string EpocaId { get; set; }
    public required string Descricao { get; set; }
    public required string ClassificacaoTipo { get; set; }
    public required int RubricaTipo { get; set; }
  }

  public class UpdateRubricaValidator : AbstractValidator<UpdateRubricaRequest>
  {
    public UpdateRubricaValidator()
    {
      _ = RuleFor(x => x.Codigo).NotEmpty();
      _ = RuleFor(x => x.EpocaId)
        .NotEmpty()
        .Must(GSHelpers.BeValidGuid)
        .WithMessage("EpocaId deve ser uma GUID válida e não estar vazia");
      _ = RuleFor(x => x.Descricao).NotEmpty();
      _ = RuleFor(x => x.ClassificacaoTipo).NotEmpty();
      _ = RuleFor(x => x.RubricaTipo).NotEmpty();
    }
  }
}
