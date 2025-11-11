using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Base.EntidadeService.DTOs
{
  public class CreateEntidadeRequest : IDto
  {
    public required string Designacao { get; set; }
    public required string Morada { get; set; }
    public required string Localidade { get; set; }
    public required Guid CodigoPostalId { get; set; }
    public required Guid PaisId { get; set; }
    public required string Telefone { get; set; }
    public required string Fax { get; set; }
    public required string EnderecoHttp { get; set; }
    public required string Email { get; set; }
  }

  public class CreateEntidadeValidator : AbstractValidator<CreateEntidadeRequest>
  {
    public CreateEntidadeValidator()
    {
      _ = RuleFor(x => x.Designacao).NotEmpty();
      _ = RuleFor(x => x.Morada).NotEmpty();
      _ = RuleFor(x => x.Localidade).NotEmpty();
      _ = RuleFor(x => x.CodigoPostalId).NotEmpty();
      _ = RuleFor(x => x.PaisId).NotEmpty();
      _ = RuleFor(x => x.Telefone).NotEmpty();
      _ = RuleFor(x => x.Fax).NotEmpty();
      _ = RuleFor(x => x.EnderecoHttp).NotEmpty();
      _ = RuleFor(x => x.Email).NotEmpty();
    }
  }
}