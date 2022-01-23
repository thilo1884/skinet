using System;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Infrastructure.Data;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
           var host = CreateHostBuilder(args).Build();
           //Here is create the DB if it does not exist 
           // we need to access Data context, but at this level is not accessable, we are outside the services container 
           //To achieve that we can use using (that clean up after ourself)
           using (var scope = host.Services.CreateScope())
           {
               var services = scope.ServiceProvider;
               var loggerFactory = services.GetRequiredService<ILoggerFactory>();
               try
               {
                   var context = services.GetRequiredService<StoreContext>();
                   await context.Database.MigrateAsync();
                   await StoreContextSeed.SeedAsync(context, loggerFactory);

                   var userManager = services.GetRequiredService<UserManager<AppUser>>();
                   var identityContext = services.GetRequiredService<AppIdentityDbContext>();
                   await identityContext.Database.MigrateAsync(); //Here is where we ll create the DB
                   await AppIdentityDbContextSeed.SeedUsersAsync(userManager); //once we have the DB we seed the data
               }
               catch (Exception ex)
               {
                   var logger = loggerFactory.CreateLogger<Program>();
                   logger.LogError(ex, "An error occured during migration");
               }
           }
           host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
