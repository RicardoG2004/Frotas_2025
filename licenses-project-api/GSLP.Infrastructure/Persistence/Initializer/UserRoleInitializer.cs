using GSLP.Domain.Entities.Common;
using GSLP.Infrastructure.Persistence.Contexts;
using Microsoft.AspNetCore.Identity;

namespace GSLP.Infrastructure.Persistence.Initializer
{
    public class UserRoleInitializer : IDbInitializer
    {
        public void Initialize(ApplicationDbContext context)
        {
            if (context.Users.Any())
            {
                return;
            }

            ApplicationUser user = new()
            {
                Id = "1b77edb4-ae80-46b5-a388-d033eeddac1d",
                Email = "administrator@globalsoft.pt",
                NormalizedEmail = "ADMINISTRATOR@GLOBALSOFT.PT",
                UserName = "administrator@globalsoft.pt.root",
                FirstName = "Rui",
                LastName = "Mesquita",
                NormalizedUserName = "ADMINISTRATOR@GLOBALSOFT.PT.ROOT",
                PhoneNumber = null,
                EmailConfirmed = true,
                PhoneNumberConfirmed = false,
                SecurityStamp = Guid.NewGuid().ToString("D"),
                ClienteId = Guid.Parse("ebe3f722-2d0c-4d87-8da3-be9c5b0dc6ca"),
                CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                CreatedOn = new DateTime(2024, 12, 24, 10, 00, 00, DateTimeKind.Utc),
            };

            PasswordHasher<ApplicationUser> password = new();
            string hashed = password.HashPassword(user, "Password123!");
            user.PasswordHash = hashed;
            _ = context.Users.Add(user);

            if (!context.Roles.Any())
            {
                List<IdentityRole> roles =
                [
                    new IdentityRole()
                    {
                        Id = "1",
                        Name = "administrator",
                        ConcurrencyStamp = Guid.NewGuid().ToString("D"),
                        NormalizedName = "ADMINISTRATOR",
                    },
                    new IdentityRole()
                    {
                        Id = "2",
                        Name = "admin",
                        ConcurrencyStamp = Guid.NewGuid().ToString("D"),
                        NormalizedName = "ADMIN",
                    },
                    new IdentityRole()
                    {
                        Id = "3",
                        Name = "client",
                        ConcurrencyStamp = Guid.NewGuid().ToString("D"),
                        NormalizedName = "CLIENT",
                    },
                ];
                context.Roles.AddRange(roles);
            }

            IdentityUserRole<string> rootAdmin = new()
            {
                RoleId = "1",
                UserId = "1b77edb4-ae80-46b5-a388-d033eeddac1d",
            };
            _ = context.UserRoles.Add(rootAdmin);
        }
    }
}
