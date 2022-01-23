using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Core.Entities.Identity
{
    //this class will not derive from BaseEntity
    public class AppUser : IdentityUser
    {
        //we just add few more propertie beside the ones already avaialbe in IdentityUser
        public string DisplayName { get; set; }
// one user can have only 1 address saved in the DB (no sddress for deliver and one for facturr etcc.)
        public Address Address { get; set; }

    }
}