using Microsoft.EntityFrameworkCore;

public class NotesDbContext : DbContext
{
  public DbSet<Note> Notes { get; set; } = null!;
  public DbSet<Auth> Auth { get; set; } = null!;
  public NotesDbContext(DbContextOptions<NotesDbContext> options) : base(options) { }
}
