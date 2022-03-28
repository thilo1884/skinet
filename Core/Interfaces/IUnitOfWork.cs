using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        //IDisposable is needed for when the transation is finished. It is gonna dispose of our context
        IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity;
        Task<int> Complete(); //return the number of changes in our DB (our Entity framework is going to track all the transation)
    }
}