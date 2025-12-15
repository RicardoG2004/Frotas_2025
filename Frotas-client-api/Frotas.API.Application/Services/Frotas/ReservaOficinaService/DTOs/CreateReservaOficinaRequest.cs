using FluentValidation;
using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.ReservaOficinaService.DTOs
{
  public class CreateReservaOficinaRequest : IDto
  {
    public required DateTime DataReserva { get; set; }
    public required Guid FuncionarioId { get; set; }
    public Guid? ViaturaId { get; set; }
    public string? HoraInicio { get; set; }
    public string? HoraFim { get; set; }
    public string? Causa { get; set; }
    public string? Observacoes { get; set; }
  }

  public class CreateReservaOficinaValidator : AbstractValidator<CreateReservaOficinaRequest>
  {
    public CreateReservaOficinaValidator()
    {
      _ = RuleFor(x => x.FuncionarioId).NotEmpty();
      _ = RuleFor(x => x.DataReserva).NotEmpty();
    }
  }
}

