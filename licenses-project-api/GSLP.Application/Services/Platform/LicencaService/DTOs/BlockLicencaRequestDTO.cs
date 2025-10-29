using FluentValidation;
using GSLP.Application.Common.Marker;

namespace GSLP.Application.Services.Platform.LicencaService.DTOs
{
    public class BlockLicencaRequestDTO : IDto
    {
        public string? MotivoBloqueio { get; set; }
    }

    public class BlockLicencaRequestDTOValidator : AbstractValidator<BlockLicencaRequestDTO>
    {
        public BlockLicencaRequestDTOValidator()
        {
            _ = RuleFor(x => x.MotivoBloqueio)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("O motivo de bloqueio é obrigatório.");
        }
    }
}
