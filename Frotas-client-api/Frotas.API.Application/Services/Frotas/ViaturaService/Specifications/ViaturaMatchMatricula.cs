using System;
using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.ViaturaService.Specifications
{
  public class ViaturaMatchMatricula : Specification<Viatura>
  {
    public ViaturaMatchMatricula(string matricula, Guid? ignoreId = null)
    {
      Query.Where(x => x.Matricula == matricula);

      if (ignoreId.HasValue)
      {
        Query.Where(x => x.Id != ignoreId.Value);
      }
    }
  }
}

