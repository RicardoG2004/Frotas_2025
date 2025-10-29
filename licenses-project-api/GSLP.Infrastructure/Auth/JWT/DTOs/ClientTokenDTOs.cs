namespace GSLP.Infrastructure.Auth.JWT.DTOs
{
  public class ClientTokenRequest
  {
    public string Email { get; set; }
    public string Password { get; set; }
  }

  public class ClientTokenResponse
  {
    public string Token { get; set; }
    public string RefreshToken { get; set; }
    public DateTime ExpiryTime { get; set; }
    public LicenseInfo License { get; set; }
    public UserInfo User { get; set; }
  }

  public class LicenseInfo
  {
    public DateTime ExpirationDate { get; set; }
    public bool IsActive { get; set; }
    public Dictionary<string, int> Permissions { get; set; }
    public List<string> Modules { get; set; }
  }

  public class UserInfo
  {
    public string Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string ImageUrl { get; set; }
    public string PhoneNumber { get; set; }
    public bool IsActive { get; set; }
    public string ClienteId { get; set; }
  }
}
