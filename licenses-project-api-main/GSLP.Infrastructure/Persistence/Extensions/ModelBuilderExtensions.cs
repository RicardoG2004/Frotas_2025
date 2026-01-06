using System.Linq.Expressions;
using GSLP.Domain.Entities.Common;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Query;

namespace GSLP.Infrastructure.Persistence.Extensions
{
    public static class ModelBuilderExtensions
    {
        public static void ApplyIdentityConfiguration(this ModelBuilder builder) // rename identity tables
        {
            _ = builder.Entity<ApplicationUser>(entity =>
            {
                _ = entity.ToTable("Users", "Identity");
            });
            _ = builder.Entity<IdentityRole>(entity =>
            {
                _ = entity.ToTable("Roles", "Identity");
            });
            _ = builder.Entity<IdentityRoleClaim<string>>(entity =>
            {
                _ = entity.ToTable("RoleClaims", "Identity");
            });

            _ = builder.Entity<IdentityUserRole<string>>(entity =>
            {
                _ = entity.ToTable("UserRoles", "Identity");
            });

            _ = builder.Entity<IdentityUserClaim<string>>(entity =>
            {
                _ = entity.ToTable("UserClaims", "Identity");
            });

            _ = builder.Entity<IdentityUserLogin<string>>(entity =>
            {
                _ = entity.ToTable("UserLogins", "Identity");
            });
            _ = builder.Entity<IdentityUserToken<string>>(entity =>
            {
                _ = entity.ToTable("UserTokens", "Identity");
            });
        }

        public static ModelBuilder AppendGlobalQueryFilter<TInterface>(
            this ModelBuilder modelBuilder,
            Expression<Func<TInterface, bool>> expression
        ) // append a query filter onto any entity class that implements the interface TInterface
        {
            IEnumerable<Type> entities = modelBuilder
                .Model // get a list of entities that implement the interface TInterface
                .GetEntityTypes()
                .Where(e => e.ClrType.GetInterface(typeof(TInterface).Name) != null)
                .Select(e => e.ClrType);
            foreach (Type entity in entities)
            {
                ParameterExpression parameterType = Expression.Parameter(
                    modelBuilder.Entity(entity).Metadata.ClrType
                );
                Expression expressionFilter = ReplacingExpressionVisitor.Replace(
                    expression.Parameters.Single(),
                    parameterType,
                    expression.Body
                );
                LambdaExpression currentQueryFilter = modelBuilder.Entity(entity).GetQueryFilter(); // get existing query filters of the entity(s)
                if (currentQueryFilter != null)
                {
                    Expression currentExpressionFilter = ReplacingExpressionVisitor.Replace(
                        currentQueryFilter.Parameters.Single(),
                        parameterType,
                        currentQueryFilter.Body
                    );
                    expressionFilter = Expression.AndAlso(
                        currentExpressionFilter,
                        expressionFilter
                    ); // append new query filter with the existing filter
                }

                LambdaExpression lambdaExpression = Expression.Lambda(
                    expressionFilter,
                    parameterType
                );

                _ = modelBuilder.Entity(entity).HasQueryFilter(lambdaExpression); // apply the filter to the entity(s)
            }
            return modelBuilder;
        }

        private static LambdaExpression GetQueryFilter(this EntityTypeBuilder builder)
        {
            return builder?.Metadata?.GetQueryFilter();
        }
    }
}
