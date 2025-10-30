using System.Linq.Expressions;
using Frotas.API.Domain.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Query;

namespace Frotas.API.Infrastructure.Persistence.Extensions
{
  public static class ModelBuilderExtensions
  {
    public static ModelBuilder AppendGlobalQueryFilter<TInterface>(
      this ModelBuilder modelBuilder,
      Expression<Func<TInterface, bool>> expression
    )
    {
      IEnumerable<Type> entities = modelBuilder
        .Model.GetEntityTypes()
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
        LambdaExpression currentQueryFilter = modelBuilder.Entity(entity).GetQueryFilter();
        if (currentQueryFilter != null)
        {
          Expression currentExpressionFilter = ReplacingExpressionVisitor.Replace(
            currentQueryFilter.Parameters.Single(),
            parameterType,
            currentQueryFilter.Body
          );
          expressionFilter = Expression.AndAlso(currentExpressionFilter, expressionFilter);
        }

        LambdaExpression lambdaExpression = Expression.Lambda(expressionFilter, parameterType);
        _ = modelBuilder.Entity(entity).HasQueryFilter(lambdaExpression);
      }
      return modelBuilder;
    }

    private static LambdaExpression GetQueryFilter(this EntityTypeBuilder builder)
    {
      return builder?.Metadata?.GetQueryFilter();
    }
  }
}
