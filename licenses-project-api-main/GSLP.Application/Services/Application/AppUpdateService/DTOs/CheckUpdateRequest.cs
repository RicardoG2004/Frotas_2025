namespace GSLP.Application.Services.Application.AppUpdateService.DTOs
{
  public class CheckUpdateRequest
  {
    public string VersaoAtual { get; set; }
    public Guid AplicacaoId { get; set; }
    public Guid? ClienteId { get; set; } // Optional: if provided, filter updates for this specific client
  }
}
