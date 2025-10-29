namespace GSLP.Domain.Entities.Common
{
    public abstract class AuditableEntityWithSoftDelete : IAuditableEntity
    {
        public Guid CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public Guid? LastModifiedBy { get; set; }
        public DateTime? LastModifiedOn { get; set; }
    }
}
