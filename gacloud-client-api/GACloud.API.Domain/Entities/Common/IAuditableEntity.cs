namespace GACloud.API.Domain.Entities.Common
{
  public interface IAuditableEntity
  {
    public Guid CreatedBy { get; set; }
    public DateTime CreatedOn { get; set; }
    public Guid? LastModifiedBy { get; set; }
    public DateTime? LastModifiedOn { get; set; }
  }
}
