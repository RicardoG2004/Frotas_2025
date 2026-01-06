namespace GSLP.Infrastructure.Auth.JWT.DTOs
{
  public class ClientTokenRequest
  {
    public string Email { get; set; }
    public string Password { get; set; }

    /// <summary>
    /// Optional client application version (e.g. frontend version "1.2.3").
    /// If provided, the server will use this value when checking for updates.
    /// </summary>
    public string? AppVersion { get; set; }
  }

  public class ClientTokenResponse
  {
    public string Token { get; set; }
    public string RefreshToken { get; set; }
    public DateTime ExpiryTime { get; set; }
    public LicenseInfo License { get; set; }
    public UserInfo User { get; set; }
    public UpdateInfo Update { get; set; }
  }

  public class UpdateInfo
  {
    public bool HasUpdate { get; set; }
    public string? UpdateId { get; set; } // ID to use for downloading the update (latest)
    public string? UpdateVersion { get; set; } // Latest version (backward compat)
    public int UpdateType { get; set; } // 1 = API, 2 = Frontend, 3 = Both
    public bool IsMandatory { get; set; }
    public string? UpdateDescription { get; set; }
    public string? ReleaseNotes { get; set; }
    public DateTime? ReleaseDate { get; set; }
    public List<UpdateItem> Updates { get; set; } = new(); // All required updates, ordered by version ASC
  }

  public class UpdateItem
  {
    public string? UpdateId { get; set; }
    public string? Version { get; set; }
    public int UpdateType { get; set; } // 1 = API, 2 = Frontend, 3 = Both
    public bool IsMandatory { get; set; }
    public string? Description { get; set; }
    public string? ReleaseNotes { get; set; }
    public DateTime? ReleaseDate { get; set; }
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
