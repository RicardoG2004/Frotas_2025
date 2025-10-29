using FluentValidation;
using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Base.EntidadeContactoService.DTOs
{
  public class UpsertEntidadeContactoBulkRequest : IDto
  {
    public required string EntidadeId { get; set; }
    public required IEnumerable<UpsertEntidadeContactoItemRequest> Contactos { get; set; }
  }

  public class UpsertEntidadeContactoBulkValidator
    : AbstractValidator<UpsertEntidadeContactoBulkRequest>
  {
    public UpsertEntidadeContactoBulkValidator()
    {
      _ = RuleFor(x => x.EntidadeId).NotEmpty();
      _ = RuleFor(x => x.Contactos).NotEmpty();
      _ = RuleForEach(x => x.Contactos).SetValidator(new UpsertEntidadeContactoItemValidator());
    }
  }
}
