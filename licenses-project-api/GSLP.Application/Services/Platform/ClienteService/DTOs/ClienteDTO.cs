using GSLP.Application.Common.Marker;

namespace GSLP.Application.Services.Platform.ClienteService.DTOs
{
    public class ClienteDTO : IDto
    {
        public string? Id { get; set; }
        public string? Nome { get; set; }
        public string? Sigla { get; set; }
        public bool? Ativo { get; set; }
        public string? NIF { get; set; }
        public bool DadosExternos { get; set; }
        public string? DadosUrl { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
