using GSLP.Domain.Entities.Common;
using GSLP.Infrastructure.Persistence.Contexts;
using Microsoft.AspNetCore.Identity;

namespace GSLP.Infrastructure.Persistence.Initializer
{
    public class ClienteUsersInitializer : IDbInitializer
    {
        public void Initialize(ApplicationDbContext context)
        {
            ApplicationUser[] users =
            [
                // Globalsoft Admin (already exists in UserRoleInitializer)

                // Hospital São João Admin
                new()
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = "admin.hsj@globalsoft.pt",
                    NormalizedEmail = "ADMIN.HSJ@GLOBALSOFT.PT",
                    UserName = "admin.hsj@globalsoft.pt",
                    FirstName = "Admin",
                    LastName = "HSJ",
                    NormalizedUserName = "ADMIN.HSJ@GLOBALSOFT.PT",
                    PhoneNumber = null,
                    EmailConfirmed = true,
                    PhoneNumberConfirmed = false,
                    SecurityStamp = Guid.NewGuid().ToString("D"),
                    ClienteId = Guid.Parse("00000001-0000-0000-0000-000000000001"),
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 00, 00, DateTimeKind.Utc),
                },
                // Câmara Municipal de Lisboa Admin
                new()
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = "admin.cml@globalsoft.pt",
                    NormalizedEmail = "ADMIN.CML@GLOBALSOFT.PT",
                    UserName = "admin.cml@globalsoft.pt",
                    FirstName = "Admin",
                    LastName = "CML",
                    NormalizedUserName = "ADMIN.CML@GLOBALSOFT.PT",
                    PhoneNumber = null,
                    EmailConfirmed = true,
                    PhoneNumberConfirmed = false,
                    SecurityStamp = Guid.NewGuid().ToString("D"),
                    ClienteId = Guid.Parse("00000001-0000-0000-0000-000000000002"),
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 01, 00, DateTimeKind.Utc),
                },
                // Grupo Hoteleiro Pestana Admin
                new()
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = "admin.ghp@globalsoft.pt",
                    NormalizedEmail = "ADMIN.GHP@GLOBALSOFT.PT",
                    UserName = "admin.ghp@globalsoft.pt",
                    FirstName = "Admin",
                    LastName = "GHP",
                    NormalizedUserName = "ADMIN.GHP@GLOBALSOFT.PT",
                    PhoneNumber = null,
                    EmailConfirmed = true,
                    PhoneNumberConfirmed = false,
                    SecurityStamp = Guid.NewGuid().ToString("D"),
                    ClienteId = Guid.Parse("00000001-0000-0000-0000-000000000003"),
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 02, 00, DateTimeKind.Utc),
                },
                // Centro Hospitalar do Porto Admin
                new()
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = "admin.chp@globalsoft.pt",
                    NormalizedEmail = "ADMIN.CHP@GLOBALSOFT.PT",
                    UserName = "admin.chp@globalsoft.pt",
                    FirstName = "Admin",
                    LastName = "CHP",
                    NormalizedUserName = "ADMIN.CHP@GLOBALSOFT.PT",
                    PhoneNumber = null,
                    EmailConfirmed = true,
                    PhoneNumberConfirmed = false,
                    SecurityStamp = Guid.NewGuid().ToString("D"),
                    ClienteId = Guid.Parse("00000001-0000-0000-0000-000000000004"),
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 03, 00, DateTimeKind.Utc),
                },
                // Câmara Municipal do Porto Admin
                new()
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = "admin.cmp@globalsoft.pt",
                    NormalizedEmail = "ADMIN.CMP@GLOBALSOFT.PT",
                    UserName = "admin.cmp@globalsoft.pt",
                    FirstName = "Admin",
                    LastName = "CMP",
                    NormalizedUserName = "ADMIN.CMP@GLOBALSOFT.PT",
                    PhoneNumber = null,
                    EmailConfirmed = true,
                    PhoneNumberConfirmed = false,
                    SecurityStamp = Guid.NewGuid().ToString("D"),
                    ClienteId = Guid.Parse("00000001-0000-0000-0000-000000000005"),
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 04, 00, DateTimeKind.Utc),
                },
                // Vila Galé Hotéis Admin
                new()
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = "admin.vgh@globalsoft.pt",
                    NormalizedEmail = "ADMIN.VGH@GLOBALSOFT.PT",
                    UserName = "admin.vgh@globalsoft.pt",
                    FirstName = "Admin",
                    LastName = "VGH",
                    NormalizedUserName = "ADMIN.VGH@GLOBALSOFT.PT",
                    PhoneNumber = null,
                    EmailConfirmed = true,
                    PhoneNumberConfirmed = false,
                    SecurityStamp = Guid.NewGuid().ToString("D"),
                    ClienteId = Guid.Parse("00000001-0000-0000-0000-000000000006"),
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 05, 00, DateTimeKind.Utc),
                },
                // Hospital da Luz Admin
                new()
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = "admin.hdl@globalsoft.pt",
                    NormalizedEmail = "ADMIN.HDL@GLOBALSOFT.PT",
                    UserName = "admin.hdl@globalsoft.pt",
                    FirstName = "Admin",
                    LastName = "HDL",
                    NormalizedUserName = "ADMIN.HDL@GLOBALSOFT.PT",
                    PhoneNumber = null,
                    EmailConfirmed = true,
                    PhoneNumberConfirmed = false,
                    SecurityStamp = Guid.NewGuid().ToString("D"),
                    ClienteId = Guid.Parse("00000001-0000-0000-0000-000000000007"),
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 06, 00, DateTimeKind.Utc),
                },
                // Câmara Municipal de Braga Admin
                new()
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = "admin.cmb@globalsoft.pt",
                    NormalizedEmail = "ADMIN.CMB@GLOBALSOFT.PT",
                    UserName = "admin.cmb@globalsoft.pt",
                    FirstName = "Admin",
                    LastName = "CMB",
                    NormalizedUserName = "ADMIN.CMB@GLOBALSOFT.PT",
                    PhoneNumber = null,
                    EmailConfirmed = true,
                    PhoneNumberConfirmed = false,
                    SecurityStamp = Guid.NewGuid().ToString("D"),
                    ClienteId = Guid.Parse("00000001-0000-0000-0000-000000000008"),
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 07, 00, DateTimeKind.Utc),
                },
                // Hospital de Braga Admin
                new()
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = "admin.hdb@globalsoft.pt",
                    NormalizedEmail = "ADMIN.HDB@GLOBALSOFT.PT",
                    UserName = "admin.hdb@globalsoft.pt",
                    FirstName = "Admin",
                    LastName = "HDB",
                    NormalizedUserName = "ADMIN.HDB@GLOBALSOFT.PT",
                    PhoneNumber = null,
                    EmailConfirmed = true,
                    PhoneNumberConfirmed = false,
                    SecurityStamp = Guid.NewGuid().ToString("D"),
                    ClienteId = Guid.Parse("00000001-0000-0000-0000-000000000009"),
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 08, 00, DateTimeKind.Utc),
                },
                // Grupo Luna Hotels & Resorts Admin
                new()
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = "admin.lhr@globalsoft.pt",
                    NormalizedEmail = "ADMIN.LHR@GLOBALSOFT.PT",
                    UserName = "admin.lhr@globalsoft.pt",
                    FirstName = "Admin",
                    LastName = "LHR",
                    NormalizedUserName = "ADMIN.LHR@GLOBALSOFT.PT",
                    PhoneNumber = null,
                    EmailConfirmed = true,
                    PhoneNumberConfirmed = false,
                    SecurityStamp = Guid.NewGuid().ToString("D"),
                    ClienteId = Guid.Parse("00000001-0000-0000-0000-000000000010"),
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 09, 00, DateTimeKind.Utc),
                },
            ];

            PasswordHasher<ApplicationUser> password = new();
            foreach (ApplicationUser user in users)
            {
                string hashed = password.HashPassword(user, "Password123!");
                user.PasswordHash = hashed;
                _ = context.Users.Add(user);

                // Create UserRole relationship with admin role (ID: "2")
                IdentityUserRole<string> userRole = new()
                {
                    UserId = user.Id,
                    RoleId = "2", // Admin role ID
                };
                _ = context.UserRoles.Add(userRole);
            }
        }
    }
}
