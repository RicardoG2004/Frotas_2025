using FluentValidation;

namespace Frotas.API.Application.Services.Base.EntidadeContactoService.DTOs
{
  public class CreateEntidadeContactoRequest : CreateEntidadeContactoItemRequest
  {
    public required string EntidadeId { get; set; }
  }

  public class CreateEntidadeContactoValidator : AbstractValidator<CreateEntidadeContactoRequest>
  {
    public CreateEntidadeContactoValidator()
    {
      Include(new CreateEntidadeContactoItemValidator());
      _ = RuleFor(x => x.EntidadeId).NotEmpty();
    }
  }
}
