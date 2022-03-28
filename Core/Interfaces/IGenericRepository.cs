using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities;
using Core.Specifications;

namespace Core.Interfaces
{
    public interface IGenericRepository<T> where T : BaseEntity
    {
        Task<T> GetByIdAsync(int id);
        Task<IReadOnlyList<T>> ListAllAsync();

        Task<T> GetEntityWithSpec(ISpecification<T> spec);
        Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec);

        Task<int> CountAsync(ISpecification<T> spec);

        //additional method to support update (all previous methods are amout get info)
        // none of these method are async, that because we are not directly updating 
        // in the database such sqlite or so. The update here is done in memory. UnitOfWork will do that
        void Add(T entity);
        void Update(T entity);
        void Delete(T entity);
    }
}