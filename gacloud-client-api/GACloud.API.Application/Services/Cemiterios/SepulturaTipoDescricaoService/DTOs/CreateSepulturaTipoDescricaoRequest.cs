using FluentValidation;
using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Cemiterios.SepulturaTipoDescricaoService.DTOs
{
  public class CreateSepulturaTipoDescricaoRequest : IDto
  {
    public required string Descricao { get; set; }
  }

  public class CreateSepulturaTipoDescricaoValidator
    : AbstractValidator<CreateSepulturaTipoDescricaoRequest>
  {
    public CreateSepulturaTipoDescricaoValidator()
    {
      _ = RuleFor(x => x.Descricao).NotEmpty();
    }
  }
}

