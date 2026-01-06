using GSLP.Domain.Entities.Common;
using GSLP.Infrastructure.Persistence.Contexts;
using Microsoft.AspNetCore.Identity;

namespace GSLP.Infrastructure.Persistence.Initializer.GAcloud
{
  public class GAcloudClientAdminUserInitializer : IDbInitializer
  {
    public void Initialize(ApplicationDbContext context)
    {
      // Câmara Municipal de Braga Admin - admin.cmb@globalsoft.pt (GAcloud)
      string adminCmbEmail = "admin.cmb@globalsoft.pt";
      ApplicationUser? existingAdminCmb = context.Users.FirstOrDefault(u =>
        u.Email == adminCmbEmail
      );

      if (existingAdminCmb == null)
      {
        // Fixed ID for admin.cmb user
        string adminCmbId = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
        Guid cmbClienteId = Guid.Parse("915220DC-CA91-4537-1763-08DE33F7F2C2");

        ApplicationUser adminCmb = new()
        {
          Id = adminCmbId,
          Email = adminCmbEmail,
          NormalizedEmail = "ADMIN.CMB@GLOBALSOFT.PT",
          UserName = adminCmbEmail,
          FirstName = "Admin",
          LastName = "CMB",
          NormalizedUserName = "ADMIN.CMB@GLOBALSOFT.PT",
          PhoneNumber = null,
          EmailConfirmed = true,
          PhoneNumberConfirmed = false,
          SecurityStamp = Guid.NewGuid().ToString("D"),
          ClienteId = cmbClienteId,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2024, 12, 24, 10, 07, 00, DateTimeKind.Utc),
          IsActive = true,
        };

        PasswordHasher<ApplicationUser> password = new();
        string hashed = password.HashPassword(adminCmb, "Password123!");
        adminCmb.PasswordHash = hashed;
        context.Users.Add(adminCmb);

        // Create UserRole relationship with admin role (ID: "2")
        IdentityUserRole<string> userRole = new()
        {
          UserId = adminCmb.Id,
          RoleId = "2", // Admin role ID
        };
        context.UserRoles.Add(userRole);
      }
      else
      {
        // User exists, ensure role is assigned
        bool roleExists = context.UserRoles.Any(ur =>
          ur.UserId == existingAdminCmb.Id && ur.RoleId == "2"
        );

        if (!roleExists)
        {
          IdentityUserRole<string> userRole = new()
          {
            UserId = existingAdminCmb.Id,
            RoleId = "2", // Admin role ID
          };
          context.UserRoles.Add(userRole);
        }
      }
    }
  }
}
