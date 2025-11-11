using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Base
{
    public static class OrigemFornecedor
    {
        public const string Nacional = "Nacional";
        public const string Internacional = "Internacional";
        public const string Local = "Intercomunitário";
    }

    [Table("Fornecedor", Schema = "Base")]
    public class Fornecedor : AuditableEntity
    {
        public string Nome { get; set; }
        public string NumContribuinte { get; set; }
        public string MoradaEscritorio { get; set; }
        public Guid CodigoPostalEscritorioId { get; set; }
        public Guid PaisEscritorioId { get; set; }
        public string MoradaCarga { get; set; }
        public Guid CodigoPostalCargaId { get; set; }
        public Guid PaisCargaId { get; set; }
        public bool MesmoEndereco { get; set; }
        public bool Ativo { get; set; }
        public string Origem { get; set; }
        public string Contacto { get; set; }
        public string Telefone { get; set; }
        public string Telemovel { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public string Url { get; set; }
        public CodigoPostal CodigoPostalEscritorio { get; set; }
        public Pais PaisEscritorio { get; set; }
        public CodigoPostal CodigoPostalCarga { get; set; }
        public Pais PaisCarga { get; set; }
    }
}

