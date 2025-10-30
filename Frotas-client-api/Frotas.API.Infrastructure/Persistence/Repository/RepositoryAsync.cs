using Ardalis.Specification;
using Ardalis.Specification.EntityFrameworkCore;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Domain.Entities.Common;
using Frotas.API.Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

// Repository class
// -- this class should be used by all application services
// -- it provides abstraction from _context, it can return DTO-mapped lists with pagination
// -- use ISpecification (Ardalis Specification) to pass query criteria, include statements, and sort expressions.
// -- returning mapped DTOs is handled by Automapper's projectTo() method for better performance when handling related entities (https://dev.to/cloudx/entity-framework-core-simplify-your-queries-with-automapper-3m8k)

namespace Frotas.API.Infrastructure.Persistence.Repository
{
  public class RepositoryAsync : IRepositoryAsync
  {
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public RepositoryAsync(ApplicationDbContext context, IMapper mapper)
    {
      _context = context;
      _mapper = mapper;
    }

    #region [-- GET --]

    // get all, return non-paginated list of domain entities
    public async Task<IEnumerable<T>> GetListAsync<T, TId>(
      ISpecification<T> specification = null,
      CancellationToken cancellationToken = default
    )
      where T : BaseEntity<TId>
    {
      IQueryable<T> query;
      if (specification == null)
      {
        query = _context.Set<T>().AsQueryable();
      }
      else
      {
        query = SpecificationEvaluator.Default.GetQuery(
          query: _context.Set<T>().AsQueryable(),
          specification: specification
        );
      }
      List<T> result = await query.ToListAsync(cancellationToken);
      return result;
    }

    // get all, return non-paginated list of mapped dtos
    public async Task<IEnumerable<TDto>> GetListAsync<T, TDto, TId>(
      ISpecification<T> specification = null,
      CancellationToken cancellationToken = default
    )
      where T : BaseEntity<TId>
      where TDto : IDto
    {
      IQueryable<T> query;
      if (specification == null)
      {
        query = _context.Set<T>().AsQueryable();
      }
      else
      {
        query = SpecificationEvaluator.Default.GetQuery(
          query: _context.Set<T>().AsQueryable(),
          specification: specification
        );
      }

      List<TDto> result = await query
        .ProjectTo<TDto>(_mapper.ConfigurationProvider)
        .ToListAsync(cancellationToken);

      return result;
    }

    // get by Id, return domain entity
    public async Task<T> GetByIdAsync<T, TId>(
      TId id,
      ISpecification<T> specification = null,
      CancellationToken cancellationToken = default
    )
      where T : BaseEntity<TId>
    {
      IQueryable<T> query;
      if (specification == null)
      {
        query = _context.Set<T>().AsQueryable();
      }
      else
      {
        query = SpecificationEvaluator.Default.GetQuery(
          query: _context.Set<T>().AsQueryable(),
          specification: specification
        );
      }

      T entity = await query.Where(x => x.Id.Equals(id)).FirstOrDefaultAsync(cancellationToken);

      if (entity != null)
      {
        return entity;
      }
      else
      {
        throw new Exception("Não encontrado");
      }
    }

    // get by Id, return mapped dtos
    public async Task<TDto> GetByIdAsync<T, TDto, TId>(
      TId id,
      ISpecification<T> specification = null,
      CancellationToken cancellationToken = default
    )
      where T : BaseEntity<TId>
      where TDto : IDto
    {
      IQueryable<T> query;
      if (specification == null)
      {
        query = _context.Set<T>().AsQueryable();
      }
      else
      {
        query = SpecificationEvaluator.Default.GetQuery(
          query: _context.Set<T>().AsQueryable(),
          specification: specification
        );
      }

      TDto result =
        await query
          .Where(x => x.Id.Equals(id))
          .ProjectTo<TDto>(_mapper.ConfigurationProvider)
          .FirstOrDefaultAsync(cancellationToken) ?? throw new Exception("Não encontrado");

      return result;
    }

    // check if exists, return true/false
    public async Task<bool> ExistsAsync<T, TId>(
      ISpecification<T> specification = null,
      CancellationToken cancellationToken = default
    )
      where T : BaseEntity<TId>
    {
      IQueryable<T> query;
      if (specification == null)
      {
        query = _context.Set<T>().AsQueryable();
      }
      else
      {
        query = SpecificationEvaluator.Default.GetQuery(
          query: _context.Set<T>().AsQueryable(),
          specification: specification
        );
      }

      bool result = await query.AnyAsync(cancellationToken);
      return result;
    }

    #endregion [-- GET --]

    #region [-- CREATE --]

    // create
    public async Task<T> CreateAsync<T, TId>(T entity)
      where T : BaseEntity<TId>
    {
      _ = await _context.Set<T>().AddAsync(entity);
      return entity;
    }

    // create range, retun list of guid
    public async Task<IList<TId>> CreateRangeAsync<T, TId>(IEnumerable<T> entityList)
      where T : BaseEntity<TId>
    {
      await _context.Set<T>().AddRangeAsync(entityList);
      return entityList.Select(x => x.Id).ToList();
    }
    #endregion [-- CREATE --]

    #region [-- UPDATE --]

    // update
    public async Task<T> UpdateAsync<T, TId>(T entity)
      where T : BaseEntity<TId>
    {
      if (_context.Entry(entity).State == EntityState.Unchanged)
      {
        throw new Exception("Nada a ser atualizado");
      }

      T entityInDb = await _context.Set<T>().FindAsync(entity.Id);
      if (entityInDb != null)
      {
        _context.Entry(entityInDb).CurrentValues.SetValues(entity);
        return entity;
      }
      else
      {
        throw new Exception("Não encontrado");
      }
    }
    #endregion [-- UPDATE --]

    #region [-- REMOVE --]

    // remove by entity
    public Task RemoveAsync<T, TId>(T entity)
      where T : BaseEntity<TId>
    {
      _ = _context.Set<T>().Remove(entity);
      return Task.CompletedTask;
    }

    // remove by Id
    public async Task<T> RemoveByIdAsync<T, TId>(TId entityId)
      where T : BaseEntity<TId>
    {
      T entity = await _context.Set<T>().FindAsync(entityId);
      if (entity == null)
      {
        throw new Exception("Não encontrado");
      }

      _ = _context.Set<T>().Remove(entity);

      return entity;
    }

    // remove multiple by Ids
    public async Task<IEnumerable<TId>> RemoveRangeAsync<T, TId>(IEnumerable<TId> ids)
      where T : BaseEntity<TId>
    {
      List<T> entities = await _context.Set<T>().Where(x => ids.Contains(x.Id)).ToListAsync();

      if (entities == null || entities.Count == 0)
      {
        throw new Exception("Nenhum registo encontrado para remover");
      }

      _context.Set<T>().RemoveRange(entities);

      return entities.Select(x => x.Id).ToList();
    }
    #endregion [-- REMOVE --]

    #region [-- PAGINATION --]
    // return paginated list of mapped dtos -- format specific to Tanstack Table v8 (React, Vue)
    public async Task<PaginatedResponse<TDto>> GetPaginatedResultsAsync<T, TDto, TId>(
      int pageNumber,
      int pageSize,
      ISpecification<T> specification = null,
      CancellationToken cancellationToken = default
    )
      where T : BaseEntity<TId>
      where TDto : IDto
    {
      IQueryable<T> query;
      if (specification == null)
      {
        query = _context.Set<T>().AsQueryable();
      }
      else
      {
        query = SpecificationEvaluator.Default.GetQuery(
          query: _context.Set<T>().AsQueryable(),
          specification: specification
        );
      }

      List<TDto> pagedResult;
      int recordsTotal;
      try
      {
        recordsTotal = await query.CountAsync(cancellationToken);
        pagedResult = await query
          .Skip((pageNumber - 1) * pageSize)
          .Take(pageSize)
          .ProjectTo<TDto>(_mapper.ConfigurationProvider)
          .ToListAsync(cancellationToken);
      }
      catch (Exception ex)
      {
        throw new Exception(ex.Message);
      }

      return new PaginatedResponse<TDto>(pagedResult, recordsTotal, pageNumber, pageSize);
    }
    #endregion [-- PAGINATION --]

    #region [-- SAVE --]

    // save the changes to database
    public async Task<int> SaveChangesAsync()
    {
      return await _context.SaveChangesAsync();
    }

    // clear the change tracker to reset context state
    public void ClearChangeTracker()
    {
      _context.ChangeTracker.Clear();
    }

    #endregion [-- SAVE --]
  }
}
