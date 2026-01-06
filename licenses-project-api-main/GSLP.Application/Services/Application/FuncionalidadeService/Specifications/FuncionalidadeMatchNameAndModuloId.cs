using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Application;

namespace GSLP.Application.Services.Application.FuncionalidadeService.Specifications
{
    public class FuncionalidadeMatchNameAndModuloId : Specification<Funcionalidade>
    {
        public FuncionalidadeMatchNameAndModuloId(string? name, Guid moduloId)
        {
            if (!string.IsNullOrWhiteSpace(name))
            {
                _ = Query.Where(f => f.Nome == name && f.ModuloId == moduloId);
            }
            _ = Query.OrderBy(f => f.Nome);
        }
    }
}

