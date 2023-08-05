using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SecureRemotePassword;

public class AuthService
{
  private readonly NotesDbContext _dbContext;
  private SrpEphemeral? _serverEphemeral;
  private string? _clientEphemeralPublic;

  // There is an issue with this code.
  // If two users were to send a authroization request at the same time,
  // There is probability that the secret will be overwritten.
  // The basic solution is to tie session management to a cookie.
  // And then use a dictionary to store the secret.
  // If this project ever grows to the point where it needs to handle
  // many simultaneous requests, then this code will need to be updated.

  private readonly IConfiguration _configuration;

  public AuthService(
    NotesDbContext dbContext,
    IConfiguration configuration
  )
  {
    _dbContext = dbContext;
    _configuration = configuration;
  }

  public Boolean ValidateEphermeralExists()
  {
    return !string.IsNullOrEmpty(_clientEphemeralPublic);
  }

  public async Task<Auth> CreateAuthAsync(Auth auth)
  {
    if (!await ValidateAuthTableEmptyAsync())
    {
      throw new Exception("Auth already exists");
    }

    _dbContext.Auth.Add(auth);

    await _dbContext.SaveChangesAsync();
    return auth;
  }

  public async Task<Boolean> DeleteAuthAsync()
  {
    var auth = await _dbContext.Auth.FirstOrDefaultAsync();

    if (auth == null)
    {
      return false;
    }

    _dbContext.Auth.Remove(auth);

    await _dbContext.SaveChangesAsync();
    return true;
  }

  public async Task<Boolean> ValidateAuthTableEmptyAsync()
  {
    return await _dbContext.Auth.AnyAsync() == false;
  }


  public async Task<object> GenerateEphemeralAsync(string clientEphemeralPublic)
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
    _serverEphemeral = server.GenerateEphemeral(verifier);

    return new
    {
      serverEphemeralPublic = _serverEphemeral.Public,
      salt = salt
    };
  }

  public async Task<string?> GenerateProof(string clientProof)
  {
    if (_serverEphemeral == null)
    {
      return null;
    }

    var auth = await _dbContext.Auth.FirstAsync();

    if (auth == null)
    {
      return null;
    }

    var server = new SrpServer();
    var serverSession = server.DeriveSession(_serverEphemeral.Secret, _clientEphemeralPublic, auth.Salt, "", auth.Verifier, clientProof);

    if (serverSession.Key == null)
    {
      return null;
    }

    return serverSession.Proof;
  }

  public string GenerateJwtToken()
  {
    var key = _configuration["Jwt:Key"];

    if (string.IsNullOrEmpty(key))
    {
      throw new Exception("Jwt:Key is null.");
    }

    var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));

    var tokenHandler = new JwtSecurityTokenHandler();
    var tokenDescriptor = new SecurityTokenDescriptor
    {
      Subject = new ClaimsIdentity(new[] { new Claim("", "Validated") }),
      Expires = DateTime.UtcNow.AddHours(1),
      SigningCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256)
    };

    var token = tokenHandler.CreateToken(tokenDescriptor);
    return tokenHandler.WriteToken(token);
  }
}
