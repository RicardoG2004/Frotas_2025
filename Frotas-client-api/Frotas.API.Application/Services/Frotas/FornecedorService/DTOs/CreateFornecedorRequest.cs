using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Frotas.FornecedorService.DTOs
{
  public class CreateFornecedorRequest : IDto
  {
    public required string Nome { get; set; }
    public required string NumContribuinte { get; set; }
    public required string MoradaEscritorio { get; set; }
    public required Guid CodigoPostalEscritorioId { get; set; }
    public required Guid PaisEscritorioId { get; set; }
    public required string MoradaCarga { get; set; }
    public required Guid CodigoPostalCargaId { get; set; }
    public required Guid PaisCargaId { get; set; }
    public required bool MesmoEndereco { get; set; }
    public required bool Ativo { get; set; }
    public required string Origem { get; set; }
    public required string Contacto { get; set; }
    public required string Telefone { get; set; }
    public required string Telemovel { get; set; }
    public required string Fax { get; set; }
    public required string Email { get; set; }
    public required string Url { get; set; }
  }

  public class CreateFornecedorValidator : AbstractValidator<CreateFornecedorRequest>
  {
    public CreateFornecedorValidator()
    {
      _ = RuleFor(x => x.Nome).NotEmpty();
      _ = RuleFor(x => x.NumContribuinte).NotEmpty();
      _ = RuleFor(x => x.MoradaEscritorio).NotEmpty();
      _ = RuleFor(x => x.CodigoPostalEscritorioId).NotEmpty();
      _ = RuleFor(x => x.PaisEscritorioId).NotEmpty();
      _ = RuleFor(x => x.MoradaCarga).NotEmpty();
      _ = RuleFor(x => x.CodigoPostalCargaId).NotEmpty();
      _ = RuleFor(x => x.PaisCargaId).NotEmpty();
      _ = RuleFor(x => x.MesmoEndereco).NotEmpty();
      _ = RuleFor(x => x.Ativo).NotEmpty();
      _ = RuleFor(x => x.Origem).NotEmpty();
      _ = RuleFor(x => x.Contacto).NotEmpty();
      _ = RuleFor(x => x.Telefone).NotEmpty();
      _ = RuleFor(x => x.Telemovel).NotEmpty();
      _ = RuleFor(x => x.Fax).NotEmpty();
      _ = RuleFor(x => x.Email).NotEmpty();
      _ = RuleFor(x => x.Url).NotEmpty();
    }
  }
}
