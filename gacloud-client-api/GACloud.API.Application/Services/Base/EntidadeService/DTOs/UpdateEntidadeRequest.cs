using FluentValidation;
using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Services.Base.EntidadeContactoService.DTOs;
using GACloud.API.Application.Utility;

namespace GACloud.API.Application.Services.Base.EntidadeService.DTOs
{
  public class UpdateEntidadeRequest : IDto
  {
    public required string Nome { get; set; }
    public required string NIF { get; set; }
    public required bool NIFEstrangeiro { get; set; }
    public required string RuaId { get; set; }
    public required string RuaNumeroPorta { get; set; }
    public string? RuaAndar { get; set; }
    public required int CartaoIdentificacaoTipoId { get; set; }
    public required string CartaoIdentificacaoNumero { get; set; }
    public required DateTime CartaoIdentificacaoDataEmissao { get; set; }
    public required DateTime CartaoIdentificacaoDataValidade { get; set; }
    public required int EstadoCivilId { get; set; }
    public required string Sexo { get; set; }
    public required bool Ativo { get; set; }
    public required bool Historico { get; set; }
    public IEnumerable<UpsertEntidadeContactoItemRequest>? Contactos { get; set; }
  }

  public class UpdateEntidadeValidator : AbstractValidator<UpdateEntidadeRequest>
  {
    public UpdateEntidadeValidator()
    {
      _ = RuleFor(x => x.Nome).NotEmpty();
      _ = RuleFor(x => x.NIF).NotEmpty();
      _ = RuleFor(x => x.RuaId)
        .NotEmpty()
        .Must(GSHelpers.BeValidGuid)
        .WithMessage("RuaId deve ser uma GUID válida e não estar vazia");
      _ = RuleFor(x => x.RuaNumeroPorta).NotEmpty();
      _ = RuleFor(x => x.CartaoIdentificacaoTipoId)
        .NotEmpty()
        .GreaterThan(0)
        .WithMessage("CartaoIdentificacaoTipoId deve ser um número inteiro válido");
      _ = RuleFor(x => x.CartaoIdentificacaoNumero).NotEmpty();
      _ = RuleFor(x => x.CartaoIdentificacaoDataEmissao)
        .NotEmpty()
        .LessThan(x => x.CartaoIdentificacaoDataValidade)
        .WithMessage("Data de emissão deve ser anterior à data de validade");
      _ = RuleFor(x => x.CartaoIdentificacaoDataValidade)
        .NotEmpty()
        .GreaterThan(x => x.CartaoIdentificacaoDataEmissao)
        .WithMessage("Data de validade deve ser posterior à data de emissão");
      _ = RuleFor(x => x.EstadoCivilId)
        .NotEmpty()
        .GreaterThan(0)
        .WithMessage("EstadoCivilId deve ser um número inteiro válido");
      _ = RuleFor(x => x.Sexo)
        .NotEmpty()
        .Must(x => x is "M" or "F")
        .WithMessage("Sexo deve ser 'M' ou 'F'");
      _ = RuleForEach(x => x.Contactos)
        .SetValidator(new UpsertEntidadeContactoItemValidator())
        .When(x => x.Contactos != null);
    }
  }
}
