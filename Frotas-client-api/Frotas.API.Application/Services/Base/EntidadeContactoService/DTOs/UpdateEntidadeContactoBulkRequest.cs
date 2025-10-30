using FluentValidation;
using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Base.EntidadeContactoService.DTOs
{
  public class UpdateEntidadeContactoBulkRequest : IDto
  {
    public required string EntidadeId { get; set; }
    public required IEnumerable<UpdateEntidadeContactoItemRequest> Contactos { get; set; }
  }

  public class UpdateEntidadeContactoBulkValidator
    : AbstractValidator<UpdateEntidadeContactoBulkRequest>
  {
    public UpdateEntidadeContactoBulkValidator()
    {
      _ = RuleFor(x => x.EntidadeId).NotEmpty();
      _ = RuleFor(x => x.Contactos).NotEmpty();
      _ = RuleForEach(x => x.Contactos).SetValidator(new UpdateEntidadeContactoItemValidator());
    }
  }
}
