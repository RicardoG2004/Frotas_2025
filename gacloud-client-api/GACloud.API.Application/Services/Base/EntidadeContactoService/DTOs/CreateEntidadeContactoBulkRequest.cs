using FluentValidation;
using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Base.EntidadeContactoService.DTOs
{
  public class CreateEntidadeContactoBulkRequest : IDto
  {
    public required string EntidadeId { get; set; }
    public required IEnumerable<CreateEntidadeContactoItemRequest> Contactos { get; set; }
  }

  public class CreateEntidadeContactoBulkValidator
    : AbstractValidator<CreateEntidadeContactoBulkRequest>
  {
    public CreateEntidadeContactoBulkValidator()
    {
      _ = RuleFor(x => x.EntidadeId).NotEmpty();
      _ = RuleFor(x => x.Contactos).NotEmpty();
      _ = RuleForEach(x => x.Contactos).SetValidator(new CreateEntidadeContactoItemValidator());
    }
  }
}
