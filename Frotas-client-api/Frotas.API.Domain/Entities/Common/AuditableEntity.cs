namespace Frotas.API.Domain.Entities.Common
{
  public abstract class AuditableEntity : BaseEntity<Guid>, IAuditableEntity
  {
    public Guid CreatedBy { get; set; }
    public DateTime CreatedOn { get; set; }
    public Guid? LastModifiedBy { get; set; }
    public DateTime? LastModifiedOn { get; set; }
  }
}
