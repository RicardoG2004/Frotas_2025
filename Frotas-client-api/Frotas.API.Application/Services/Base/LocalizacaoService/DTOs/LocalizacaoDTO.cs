using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Services.Base.CodigoPostalService.DTOs;
using Frotas.API.Application.Services.Base.FreguesiaService.DTOs;

namespace Frotas.API.Application.Services.Base.LocalizacaoService.DTOs
{
    public class LocalizacaoDTO : IDto
    {
        public Guid Id { get; set; }
        public string Designacao { get; set; }
        public string Morada { get; set; }
        public Guid CodigoPostalId { get; set; }
        public CodigoPostalDTO CodigoPostal { get; set; }
        public Guid FreguesiaId { get; set; }
        public FreguesiaDTO Freguesia { get; set; }
        public string Telefone { get; set; }
        public string Email { get; set; }
        public string Fax { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}