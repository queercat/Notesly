using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]/[action]")]
public class PostController : Controller
{
  private readonly NotesDbContext _dbContext;

  public PostController(
    NotesDbContext dbContext
  )
  {
    _dbContext = dbContext;
  }

  [HttpGet]
  [Authorize]
  public Note[] GetPosts()
  {
    return _dbContext.Notes.ToArray();
  }

  [HttpPost]
  [Authorize]
  public async Task<ActionResult> CreatePost([FromBody] CreateNote content)
  {

    var note = new Note { Title = content.Title, Content = content.Content };

    _dbContext.Notes.Add(note);

    await _dbContext.SaveChangesAsync();
    return new OkObjectResult(note);
  }
}
