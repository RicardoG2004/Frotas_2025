using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Base.GarantiaService.DTOs
{
    public class GarantiaDTO : IDto
    {
        public Guid Id { get; set; }
        public string? Designacao { get; set; }
        public int Anos { get; set; }
        public int Kms { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}