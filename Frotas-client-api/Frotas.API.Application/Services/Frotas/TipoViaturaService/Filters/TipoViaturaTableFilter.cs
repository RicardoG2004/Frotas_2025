using System.Collections.Generic;
using FluentValidation;
using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Frotas.TipoViaturaService.Filters
{
  public class TipoViaturaTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }
  }

  public class TipoViaturaTableFilterValidator : AbstractValidator<TipoViaturaTableFilter>
  {
    public TipoViaturaTableFilterValidator()
    {
      _ = RuleFor(x => x.Filters).NotEmpty();
    }
  }
}