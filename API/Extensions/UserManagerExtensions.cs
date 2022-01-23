using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class UserManagerExtensions //as every extenstion we make it static
    {
        public static async Task<AppUser> FindByUserClaimsPrincipalEmailWithAddressAsync(this UserManager<AppUser> input,
                                                                      ClaimsPrincipal user )
        {
            var email = user.FindFirstValue(ClaimTypes.Email);

            //Here we have access to all the methods (such as include) that we 
            // did not have in the userManager
            return await input.Users.Include(x => x.Address).SingleOrDefaultAsync( x => x.Email == email);
        }
    }
}