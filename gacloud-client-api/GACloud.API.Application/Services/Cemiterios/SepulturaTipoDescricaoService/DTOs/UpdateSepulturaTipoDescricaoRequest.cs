using FluentValidation;
using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Cemiterios.SepulturaTipoDescricaoService.DTOs
{
  public class UpdateSepulturaTipoDescricaoRequest : IDto
  {
    public required string Descricao { get; set; }
  }

  public class UpdateSepulturaTipoDescricaoValidator
    : AbstractValidator<UpdateSepulturaTipoDescricaoRequest>
  {
    public UpdateSepulturaTipoDescricaoValidator()
    {
      _ = RuleFor(x => x.Descricao).NotEmpty();
    }
  }
}

