namespace GSLP.Application.Services.Application.AppUpdateService.DTOs
{
    public class CheckUpdateResponse
    {
        public bool TemUpdate { get; set; }
        public AppUpdateDTO? UpdateDisponivel { get; set; }
        public List<AppUpdateDTO> UpdatesDisponiveis { get; set; } = new();
        public bool Obrigatorio { get; set; }
    }
}





