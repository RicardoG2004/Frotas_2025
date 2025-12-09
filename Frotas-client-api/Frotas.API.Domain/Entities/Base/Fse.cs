using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Base
{
    public static class OrigemFse
    {
        public const string Nacional = "Nacional";
        public const string Internacional = "Internacional";
        public const string Local = "Intercomunitário";
    }

    [Table("Fse", Schema = "Base")]
    public class Fse : AuditableEntity
    {
        public string Nome { get; set; }
        public string NumContribuinte { get; set; }
        public string? Morada { get; set; }
        public Guid? CodigoPostalId { get; set; }
        public CodigoPostal? CodigoPostal { get; set; }
        public Guid? PaisId { get; set; }
        public Pais? Pais { get; set; }
        public string? Contacto { get; set; }
        public string Telefone { get; set; }
        public string? Fax { get; set; }
        public string? Email { get; set; }
        public string? EnderecoHttp { get; set; }
        public string? Origem { get; set; }

    }
}