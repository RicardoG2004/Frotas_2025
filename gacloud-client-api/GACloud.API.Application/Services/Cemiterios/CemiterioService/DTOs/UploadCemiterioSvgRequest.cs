using FluentValidation;
using GACloud.API.Application.Common.Marker;
using Microsoft.AspNetCore.Http;

namespace GACloud.API.Application.Services.Cemiterios.CemiterioService.DTOs
{
  public class UploadCemiterioSvgRequest : IDto
  {
    public required IFormFile SvgFile { get; set; }
    public required string FileName { get; set; }
  }

  public class UploadCemiterioSvgValidator : AbstractValidator<UploadCemiterioSvgRequest>
  {
    public UploadCemiterioSvgValidator()
    {
      _ = RuleFor(x => x.SvgFile)
        .NotNull()
        .WithMessage("O arquivo SVG é obrigatório")
        .Must(file => file.ContentType == "image/svg+xml")
        .WithMessage("O arquivo deve ser um SVG válido");

      _ = RuleFor(x => x.FileName)
        .NotEmpty()
        .WithMessage("O nome do arquivo é obrigatório")
        .Matches(@"^[a-zA-Z0-9-_]+\.svg$")
        .WithMessage("O nome do arquivo deve ser válido e terminar com .svg");
    }
  }
}

