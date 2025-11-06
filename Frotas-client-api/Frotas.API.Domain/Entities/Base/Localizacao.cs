using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Base
{
    [Table("Localizacao", Schema = "Base")]
    public class Localizacao : AuditableEntity
    {
        public string Designacao { get; set; }
        public string Morada { get; set; }
        public Guid CodigoPostalId { get; set; }
        public CodigoPostal CodigoPostal { get; set; }
        public Guid FreguesiaId { get; set; }
        public Freguesia Freguesia { get; set; }
        public string Telefone { get; set; }
        public string Email { get; set; }
        public string Fax { get; set; }
    }
}