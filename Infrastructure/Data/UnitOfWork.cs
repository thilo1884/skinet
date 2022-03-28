using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private Hashtable _repositories; //any repository used, will be saved in this hashtable
        private readonly StoreContext _context;
        public UnitOfWork(StoreContext context) //the contructor will create the new storeContext
        {
            _context = context; 
        }

        public async Task<int> Complete()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        //Add addictional repo
        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
        {
            if(_repositories == null) _repositories = new Hashtable();

            var type = typeof(TEntity).Name; //we get the name of entity

            if (!_repositories.ContainsKey(type)) //e.g. if hashtable contains already a product repo?
            {
                var repositoryType = typeof(GenericRepository<>);
                var repositoryIstance = Activator.CreateInstance(repositoryType.MakeGenericType(typeof(TEntity)), _context);

                _repositories.Add(type, repositoryIstance); //add repo to the hastble
            }

            return (IGenericRepository<TEntity>) _repositories[type];
        }
    }
}