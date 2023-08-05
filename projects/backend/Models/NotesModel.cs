using Microsoft.EntityFrameworkCore;

public class Auth
{
  public int Id { get; set; }
  public string Salt { get; set; } = "";
  public string Verifier { get; set; } = "";
}

public class CreateAuth
{
  public string Salt { get; set; } = "";
  public string Verifier { get; set; } = "";
}

public class Note
{
  public int Id { get; set; }
  public string Title { get; set; } = "";
  public string Content { get; set; } = "";
}

public class CreateNote
{
  public string Title { get; set; } = "";
  public string Content { get; set; } = "";
}
