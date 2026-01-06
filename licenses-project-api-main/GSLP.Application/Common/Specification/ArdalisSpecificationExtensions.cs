using System.Linq.Expressions;
using System.Reflection;
using Ardalis.Specification;

namespace GSLP.Application.Common.Specification
{
    // extension to Ardalis.Specification
    // allows OrderBy method to accept a string list of columns for sort ordering, for example: ('Name,-Supplier,Property.Name,Price') -prefix denotes Descending
    // JQuery Datatables and Tanstack table are components that send dynamic column ordering

    public static class ArdalisSpecificationExtensions
    {
        public static IOrderedSpecificationBuilder<T> OrderBy<T>(
            this ISpecificationBuilder<T> specificationBuilder,
            string orderByFields
        )
        {
            var fields = ParseOrderBy(orderByFields);
            if (fields != null)
            {
                foreach (var field in fields)
                {
                    Type targetType = typeof(T);
                    PropertyInfo matchedProperty = FindNestedProperty(
                        targetType,
                        field.Key.ToLower()
                    );

                    if (matchedProperty == null)
                        throw new ArgumentNullException("name");

                    var paramExpr = Expression.Parameter(typeof(T));

                    Expression propertyExpr = paramExpr;
                    foreach (string member in field.Key.Split('.'))
                    {
                        propertyExpr = Expression.PropertyOrField(propertyExpr, member);
                    }

                    var keySelector = Expression.Lambda<Func<T, object?>>(
                        Expression.Convert(propertyExpr, typeof(object)),
                        paramExpr
                    );

                    (
                        (List<OrderExpressionInfo<T>>)
                            specificationBuilder.Specification.OrderExpressions
                    ).Add(new OrderExpressionInfo<T>(keySelector, field.Value));
                }
            }
            var orderedSpecificationBuilder = new OrderedSpecificationBuilder<T>(
                specificationBuilder.Specification
            );

            return orderedSpecificationBuilder;
        }

        // helper method for cases where the column property is nested, for example 'Supplier.Name'
        public static PropertyInfo FindNestedProperty(Type type, string propertyName)
        {
            string[] propertyNames = propertyName.Split('.'); // Split the property name by dot to handle nesting

            Type currentType = type;
            PropertyInfo property = null;

            foreach (string name in propertyNames)
            {
                PropertyInfo? nestedProperty = currentType
                    .GetProperties()
                    .FirstOrDefault(p => p.Name.Equals(name, StringComparison.OrdinalIgnoreCase));

                if (nestedProperty == null)
                {
                    return null; // Property not found at this level
                }

                currentType = nestedProperty.PropertyType;
                property = nestedProperty;
            }

            return property;
        }

        // helper method to parse the input string and turn it into something that Ardalis.Specification understands - a list of column names with their sort order
        private static IDictionary<string, OrderTypeEnum> ParseOrderBy(string orderByFields)
        {
            if (orderByFields is null)
                return null;
            var result = new Dictionary<string, OrderTypeEnum>();
            var fields = orderByFields.Split(',');
            for (var index = 0; index < fields.Length; index++)
            {
                var field = fields[index];
                var orderBy = OrderTypeEnum.OrderBy;
                if (field.StartsWith('-'))
                    orderBy = OrderTypeEnum.OrderByDescending;
                if (index > 0)
                {
                    orderBy = OrderTypeEnum.ThenBy;
                    if (field.StartsWith('-'))
                        orderBy = OrderTypeEnum.ThenByDescending;
                }
                if (field.StartsWith('-'))
                    field = field.Substring(1);
                result.Add(field, orderBy);
            }
            return result;
        }
    }
}
