using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Application;

namespace GSLP.Application.Services.Application.FuncionalidadeService.Specifications
{
    public class FuncionalidadeMatchNameAndModuloIdExcludingId : Specification<Funcionalidade>
    {
        public FuncionalidadeMatchNameAndModuloIdExcludingId(string? name, Guid moduloId, Guid excludeId)
        {
            if (!string.IsNullOrWhiteSpace(name))
            {
                _ = Query.Where(f => f.Nome == name && f.ModuloId == moduloId && f.Id != excludeId);
            }
            _ = Query.OrderBy(f => f.Nome);
        }
    }
}

