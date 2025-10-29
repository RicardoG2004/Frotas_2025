namespace GACloud.API.Domain.Common
{
  public interface ISoftDelete
  {
    DateTime? DeletedOn { get; set; }
    string? DeletedBy { get; set; }
  }
}
