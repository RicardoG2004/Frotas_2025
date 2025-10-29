using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Services.Cemiterios.SepulturaService.DTOs;

namespace GACloud.API.Application.Services.Cemiterios.ProprietarioService.DTOs
{
  public class ProprietarioSepulturaDTO : IDto
  {
    public Guid Id { get; set; }
    public Guid ProprietarioId { get; set; }
    public ProprietarioDTO? Proprietario { get; set; }
    public Guid SepulturaId { get; set; }
    public SepulturaDTO? Sepultura { get; set; }
    public DateTime Data { get; set; }
    public bool Ativo { get; set; }
    public bool IsProprietario { get; set; }
    public bool IsResponsavel { get; set; }
    public bool IsResponsavelGuiaReceita { get; set; }
    public DateTime? DataInativacao { get; set; }
    public string? Fracao { get; set; }
    public bool Historico { get; set; }
    public string? Observacoes { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}

