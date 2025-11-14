using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Services.Base.CargoService.DTOs;
using Frotas.API.Application.Services.Base.CodigoPostalService.DTOs;
using Frotas.API.Application.Services.Base.DelegacaoService.DTOs;
using Frotas.API.Application.Services.Base.FreguesiaService.DTOs;

namespace Frotas.API.Application.Services.Base.FuncionarioService.DTOs
{
    public class FuncionarioDTO : IDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; }
        public string Morada { get; set; }
        public Guid CodigoPostalId { get; set; }
        public CodigoPostalDTO CodigoPostal { get; set; }
        public Guid FreguesiaId { get; set; }
        public FreguesiaDTO Freguesia { get; set; }
        public Guid CargoId { get; set; }
        public CargoDTO Cargo { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public Guid DelegacaoId { get; set; }
        public DelegacaoDTO Delegacao { get; set; }
        public bool Ativo { get; set; }
    }
}