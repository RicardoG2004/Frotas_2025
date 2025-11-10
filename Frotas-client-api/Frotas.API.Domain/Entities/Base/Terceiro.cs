using System;
using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Base
{
    [Table("Terceiro", Schema = "Base")]
    public class Terceiro : AuditableEntity
    {
        public string Nome { get; set; }
        public string NIF { get; set; }
        public string Morada { get; set; }
        public Guid CodigoPostalId { get; set; }
        public CodigoPostal CodigoPostal { get; set; }
    }
}