using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Base
{
    [Table("Funcionario", Schema = "Base")]
    public class Funcionario : AuditableEntity
    {
        public string Nome { get; set; }
        public string Morada { get; set; }
        public Guid FreguesiaId { get; set; }
        public Freguesia Freguesia { get; set; }
        public Guid CodigoPostalId { get; set; }
        public CodigoPostal CodigoPostal { get; set; }
        public Guid CargoId { get; set; }
        public Cargo Cargo { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public Guid DelegacaoId { get; set; }
        public Delegacao Delegacao { get; set; }
        public bool Ativo { get; set; }

    }
}