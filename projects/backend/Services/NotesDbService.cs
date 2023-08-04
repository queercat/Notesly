using Microsoft.EntityFrameworkCore;

public class NotesDbService
{
  private readonly NotesDbContext _dbContext;

  public NotesDbService(
    NotesDbContext dbContext)
  {
    _dbContext = dbContext;
  }

  public async Task<Note> CreateNoteAsync(Note note)
  {
    _dbContext.Notes.Add(note);
    await _dbContext.SaveChangesAsync();
    return note;
  }

  public async Task<Note[]?> GetNotesAsync()
  {
    return await _dbContext.Notes.ToArrayAsync();
  }
}
