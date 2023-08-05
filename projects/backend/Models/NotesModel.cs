using Microsoft.EntityFrameworkCore;

public class Auth
{
  int Id { get; set; }
  public string Salt { get; set; } = "";
  public string Verifier { get; set; } = "";
}

public class Note
{
  public int Id { get; set; }
  public string Title { get; set; } = "";
  public string Content { get; set; } = "";
}
