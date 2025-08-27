using Microsoft.EntityFrameworkCore;
using TaskApi.Models;

namespace TaskApi.Data
{// AppDbContext: The EF Core gateway to your database
    public class AppDbContext : DbContext
    {// This constructor lets ASP.NET inject options (like the connection string)
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        // DbSet<T> maps your model to a table (TaskItem -> Tasks)
        public DbSet<TaskItem> Tasks => Set<TaskItem>();
    }
}