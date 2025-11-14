using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.FuncionarioService.Specifications
{
    public class FuncionarioMatchName : Specification<Funcionario>
    {
        public FuncionarioMatchName(string nome)
        {
            Query.Where(x => x.Nome == nome);
        }
    }
}
