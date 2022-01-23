using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContext : IdentityDbContext<AppUser>
    {
        //because we do have another DbContextOptionsm we have to specify the type in <>
        public AppIdentityDbContext(DbContextOptions<AppIdentityDbContext> options) : base(options)
        {
            //we do not have to set anything, everything is done in the class we derive from (IdentityDbContext)
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder); //We have do this to don`t have problem with the primary key.
            // we have to add this service in Startup.cs, there a new DB in sqlite will be created
        }
    }
}