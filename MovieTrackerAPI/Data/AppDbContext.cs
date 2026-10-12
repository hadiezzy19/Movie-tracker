using Microsoft.EntityFrameworkCore;
using MovieTrackerAPI.Models;

namespace MovieTrackerAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> User { get; set; }
    

    public DbSet<Movie> Movies { get; set; } 
    public DbSet<Review> Reviews { get; set; }
}