using GSLP.Domain.Entities.Catalog.Platform;
using GSLP.Domain.Entities.Common;
using GSLP.Infrastructure.Persistence.Contexts;
using Microsoft.AspNetCore.Identity;

namespace GSLP.Infrastructure.Persistence.Initializer.GAcloud
{
  public class GAcloudClientUserInitializer : IDbInitializer
  {
    public void Initialize(ApplicationDbContext context)
    {
      // GAcloud Client User - cliente.cmb@globalsoft.pt
      string clientUserId = "7cdab3df-8ce5-43a2-91b9-b607d687ab92";
      Guid cmbClienteId = Guid.Parse("915220DC-CA91-4537-1763-08DE33F7F2C2");
      Guid cmbLicencaId = Guid.Parse("C21D550C-5ECF-4486-CCD3-08DE33DCD237");
      string clientRoleId = "3"; // "client" role ID

      // Check if user already exists
      ApplicationUser? existingUser = context.Users.FirstOrDefault(u => u.Id == clientUserId);

      if (existingUser == null)
      {
        // Create the client user
        ApplicationUser clientUser = new()
        {
          Id = clientUserId,
          Email = "cliente.cmb@globalsoft.pt",
          NormalizedEmail = "CLIENTE.CMB@GLOBALSOFT.PT",
          UserName = "cliente.cmb@globalsoft.pt",
          NormalizedUserName = "CLIENTE.CMB@GLOBALSOFT.PT",
          FirstName = "Bruno",
          LastName = "Ferreira",
          PhoneNumber = null,
          EmailConfirmed = true,
          PhoneNumberConfirmed = false,
          SecurityStamp = "RMQYTB4MCHH5UMASGHOKY6E3HMWLOTAK",
          PasswordHash =
            "AQAAAAIAAYagAAAAECoYlStMKEdnay6TVGxrWrb3gjp0G0DkMjsq29aFWpeRHk4SyE7UF1tj/N924+Iyzg==",
          ClienteId = cmbClienteId,
          CreatedBy = Guid.Parse("b3357177-1653-4d19-b554-50cd60c41776"),
          CreatedOn = new DateTime(2025, 11, 14, 14, 53, 56, 610, DateTimeKind.Utc).AddTicks(278),
          IsActive = true,
        };

        context.Users.Add(clientUser);
      }

      // Check if user-role relationship exists
      bool userRoleExists = context.UserRoles.Any(ur =>
        ur.UserId == clientUserId && ur.RoleId == clientRoleId
      );

      if (!userRoleExists)
      {
        IdentityUserRole<string> userRole = new()
        {
          UserId = clientUserId,
          RoleId = clientRoleId, // "client" role
        };
        context.UserRoles.Add(userRole);
      }

      // Check if user-license relationship exists
      bool userLicenseExists = context.LicencasUtilizadores.Any(lu =>
        lu.LicencaId == cmbLicencaId && lu.UtilizadorId == clientUserId
      );

      if (!userLicenseExists)
      {
        // Create the LicencaUtilizador relationship for GAcloud client user
        LicencaUtilizador licencaUtilizador = new()
        {
          LicencaId = cmbLicencaId,
          UtilizadorId = clientUserId,
          Ativo = true,
        };

        context.LicencasUtilizadores.Add(licencaUtilizador);
      }
    }
  }
}
