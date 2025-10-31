using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Services.Base.CodigoPostalService.DTOs;
using Frotas.API.Application.Services.Base.PaisService.DTOs;

namespace Frotas.API.Application.Services.Frotas.FornecedorService.DTOs
{
  public class FornecedorDTO : IDto
  {
        public Guid Id { get; set; }
        public required string Nome { get; set; }
        public required string NumContribuinte { get; set; }
        public required string MoradaEscritorio { get; set; }
        public required Guid CodigoPostalEscritorioId { get; set; }
        public required Guid PaisEscritorioId { get; set; }
        public required string MoradaCarga { get; set; }
        public required Guid CodigoPostalCargaId { get; set; }
        public required Guid PaisCargaId { get; set; }
        public required bool MesmoEndereco { get; set; }
        public required bool Ativo { get; set; }
        public required string Origem { get; set; }
        public required string Contacto { get; set; }
        public required string Telefone { get; set; }
        public required string Telemovel { get; set; }
        public required string Fax { get; set; }
        public required string Email { get; set; }
        public required string Url { get; set; }
        public CodigoPostalDTO? CodigoPostalEscritorio { get; set; }
        public PaisDTO? PaisEscritorio { get; set; }
        public CodigoPostalDTO? CodigoPostalCarga { get; set; }
        public PaisDTO? PaisCarga { get; set; }
        public DateTime CreatedOn { get; set; }
  }
}
