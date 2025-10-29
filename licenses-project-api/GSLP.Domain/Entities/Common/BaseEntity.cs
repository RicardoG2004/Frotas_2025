namespace GSLP.Domain.Entities.Common
{
    public abstract class BaseEntity<TId>
    {
        public TId Id { get; set; }
    }
}
