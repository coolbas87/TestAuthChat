using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SvcSms.Model
{
    public class AppContext: DbContext
    {
        public DbSet<User> Users { get; set; }
        public AppContext(DbContextOptions<AppContext> options)
            : base(options)
        {
            Database.EnsureCreated(); 
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(
                new User[]
                {
                    new User { id = 1, Login="UserAdmin@nowhere.com", Password="11111" },
                    new User { id = 2, Login="User@nowhere.com", Password="22222" }
                });
        }
    }
}
