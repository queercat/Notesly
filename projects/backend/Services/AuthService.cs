using Microsoft.EntityFrameworkCore;
using SecureRemotePassword;

public class AuthService
{
  private readonly NotesDbContext _dbContext;
  private string _clientEphemeralPublic = "";
  private string _secret = ""; // There is an issue with this code.
  // If two users were to send a authroization request at the same time,
  // There is probability that the secret will be overwritten.
  // The basic solution is to tie session management to a cookie.
  // And then use a dictionary to store the secret.
  // If this project ever grows to the point where it needs to handle
  // many simultaneous requests, then this code will need to be updated.

  public AuthService(
    NotesDbContext dbContext)
  {
    _dbContext = dbContext;
  }

  public async Task<Auth> CreateAuthAsync(Auth auth)
  {
    if (await ValidateAuthTableEmptyAsync())
    {
      throw new Exception("Auth already exists");
    }


    _dbContext.Auth.Add(auth);
    await _dbContext.SaveChangesAsync();
    return auth;
  }

  public async Task<Boolean> ValidateAuthTableEmptyAsync()
  {
    return await _dbContext.Auth.AnyAsync() == false;
  }


  public async Task<string> GenerateEphemeralAsync(string clientEphemeralPublic)
  {
    var auth = await _dbContext.Auth.FirstAsync();

    if (auth == null)
    {
      throw new Exception("Auth not found");
    }

    _clientEphemeralPublic = clientEphemeralPublic;

    var verifier = auth.Verifier;
    var salt = auth.Salt;

    var server = new SrpServer();
    var serverEphemeral = server.GenerateEphemeral(verifier);

    return serverEphemeral.Public;
  }

  public async Task<SrpSession?> GenerateProof(string clientProof)
  {
    var auth = await _dbContext.Auth.FirstAsync();

    if (auth == null)
    {
      throw new Exception("Auth not found");
    }

    var server = new SrpServer();
    var serverSession = server.DeriveSession(_secret, _clientEphemeralPublic, auth.Salt, "", auth.Verifier, clientProof);

    return serverSession;
  }
}
