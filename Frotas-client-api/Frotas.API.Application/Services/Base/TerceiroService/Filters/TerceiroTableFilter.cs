using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Base.TerceiroService.Filters
{
  public class TerceiroTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }
  }

  public class TerceiroTableFilterValidator : AbstractValidator<TerceiroTableFilter>
  {
    public TerceiroTableFilterValidator()
    {
      _ = RuleFor(x => x.Filters).NotEmpty();
    }
  }
}