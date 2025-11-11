using System.Collections.Generic;
using FluentValidation;
using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Frotas.ViaturaService.Filters
{
  public class ViaturaTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public ViaturaTableFilter()
    {
      Filters = [];
    }
  }

  public class ViaturaTableFilterValidator : AbstractValidator<ViaturaTableFilter>
  {
    public ViaturaTableFilterValidator()
    {
      _ = RuleFor(x => x.PageNumber).GreaterThan(0);
      _ = RuleFor(x => x.PageSize).GreaterThan(0);
    }
  }
}

