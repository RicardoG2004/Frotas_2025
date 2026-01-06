using System.ComponentModel.DataAnnotations.Schema;
using GSLP.Domain.Entities.Catalog.Platform;
using Microsoft.AspNetCore.Identity;

namespace GSLP.Domain.Entities.Common
{
    public class ApplicationUser : IdentityUser, IAuditableEntity, ISoftDelete
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool IsActive { get; set; } = true;
        public string ImageUrl { get; set; }
        public string RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }

        [NotMapped]
        public string RoleId { get; set; }

        public Guid? ClienteId { get; set; }
        public Cliente Cliente { get; set; }
        public ICollection<LicencaUtilizador> LicencasUtilizadores { get; set; } = [];
        public ICollection<PerfilUtilizador> PerfisUtilizadores { get; set; } = [];

        //-- Auditable / Soft Delete Fields --//

        public Guid CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public Guid? LastModifiedBy { get; set; }
        public DateTime? LastModifiedOn { get; set; }
        public Guid? DeletedBy { get; set; }
        public DateTime? DeletedOn { get; set; }
    }
}
