using System.Linq.Expressions;
using Ardalis.Specification;
using Ardalis.Specification.EntityFrameworkCore;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using GSLP.Application.Common;
using GSLP.Application.Common.Marker;
using GSLP.Application.Common.Wrapper;
using GSLP.Domain.Entities.Common;
using GSLP.Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

// Repository class
// -- this class should be used by all application services
// -- it provides abstraction from _context, it can return DTO-mapped lists with pagination
// -- use ISpecification (Ardalis Specification) to pass query criteria, include statements, and sort expressions.
// -- returning mapped DTOs is handled by Automapper's projectTo() method for better performance when handling related entities (https://dev.to/cloudx/entity-framework-core-simplify-your-queries-with-automapper-3m8k)

namespace GSLP.Infrastructure.Persistence.Repository
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

            T entity = await query
                .Where(x => x.Id.Equals(id))
                .FirstOrDefaultAsync(cancellationToken);

            return entity; // No exception thrown; just return null if not found
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

            TDto result = await query
                .Where(x => x.Id.Equals(id))
                .ProjectTo<TDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(cancellationToken);

            return result; // Return null if not found
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

        // FirstOrDefault with Specification, return domain entity
        public async Task<T> FirstOrDefaultAsync<T, TId>(
            ISpecification<T> specification = null,
            CancellationToken cancellationToken = default
        )
            where T : BaseEntity<TId>
        {
            IQueryable<T> query = _context.Set<T>().AsQueryable();

            // Apply specification if provided
            if (specification != null)
            {
                query = SpecificationEvaluator.Default.GetQuery(query, specification);
            }

            // Execute the query and return the first result or null
            return await query.FirstOrDefaultAsync(cancellationToken);
        }

        // FirstOrDefault with Specification, return mapped DTO
        public async Task<TDto> FirstOrDefaultAsync<T, TDto, TId>(
            ISpecification<T> specification = null,
            CancellationToken cancellationToken = default
        )
            where T : BaseEntity<TId>
            where TDto : IDto
        {
            IQueryable<T> query = _context.Set<T>().AsQueryable();

            // Apply specification if provided
            if (specification != null)
            {
                query = SpecificationEvaluator.Default.GetQuery(query, specification);
            }

            // Execute the query, project to the DTO, and return the first result or null
            return await query
                .ProjectTo<TDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(cancellationToken);
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
                throw new Exception("Nada para atualizar");
            }

            T entityInDb = await _context.Set<T>().FindAsync(entity.Id);
            if (entityInDb != null)
            {
                _context.Entry(entityInDb).CurrentValues.SetValues(entity);
                return entity;
            }
            else
            {
                throw new Exception("Não Encontrado");
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
                throw new Exception("Não Encontrado");
            }

            _ = _context.Set<T>().Remove(entity);

            return entity;
        }

        // Remove multiple entities by entity
        public Task RemoveAllAsync<T, TId>(IEnumerable<T> entities)
            where T : BaseEntity<TId>
        {
            _context.Set<T>().RemoveRange(entities);
            return Task.CompletedTask;
        }

        // Remove multiple entities by ID
        public async Task RemoveAllByIdAsync<T, TId>(IEnumerable<TId> entityIds)
            where T : BaseEntity<TId>
        {
            foreach (TId entityId in entityIds)
            {
                _ = await RemoveByIdAsync<T, TId>(entityId);
            }
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

        #endregion [-- SAVE --]

        // public async Task DeleteWhereAsync<T>(
        //     Expression<Func<T, bool>> predicate,
        //     ISpecification<T> specification = null
        // )
        //     where T : class
        // {
        //     var entities = await _context.Set<T>().Where(predicate).ToListAsync();
        //     _context.Set<T>().RemoveRange(entities);
        // }

        public async Task DeleteWhereAsync<T>(
            Expression<Func<T, bool>> predicate,
            ISpecification<T> specification = null,
            CancellationToken cancellationToken = default
        )
            where T : class
        {
            IQueryable<T> query = _context.Set<T>().Where(predicate); // Always use the provided predicate

            // Apply the specification if it's provided
            if (specification != null)
            {
                query = SpecificationEvaluator.Default.GetQuery(query, specification);
            }

            // Fetch the entities that match the predicate and specification
            var entities = await query.ToListAsync(cancellationToken);

            // Remove the entities from the context
            _context.Set<T>().RemoveRange(entities);
        }

        public async Task<IList<TId>> RemoveRangeByIdAsync<T, TId>(IEnumerable<TId> ids)
            where T : BaseEntity<TId>
        {
            List<TId> successfullyDeleted = new();

            foreach (TId id in ids)
            {
                try
                {
                    T entity = await _context.Set<T>().FindAsync(id);
                    if (entity != null)
                    {
                        _ = _context.Set<T>().Remove(entity);
                        successfullyDeleted.Add(id);
                    }
                }
                catch
                {
                    // Continue with next id if one fails
                    continue;
                }
            }

            return successfullyDeleted;
        }
    }
}
