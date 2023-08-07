using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SecureRemotePassword;

public class AuthService
{
  private readonly NotesDbContext _dbContext;
  private readonly IConfiguration _configuration;
  private readonly SrpServer _srpServer = new();

  public AuthService(
    NotesDbContext dbContext,
    IConfiguration configuration
  )
  {
    _dbContext = dbContext;
    _configuration = configuration;
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

  public async Task<object> GenerateEphemeralAsync(string clientPublicEphemeral)
  {
    var auth = await _dbContext.Auth.FirstAsync() ?? throw new Exception("Auth not found");

    var verifier = auth.Verifier;
    var salt = auth.Salt;

    var serverEphemeral = _srpServer.GenerateEphemeral(verifier);

    auth.ServerEphemeralPublic = serverEphemeral.Public;
    auth.ServerEphemeralSecret = serverEphemeral.Secret;
    auth.ClientEphemeralPublic = clientPublicEphemeral;

    await _dbContext.SaveChangesAsync();

    return new
    {
      serverEphemeralPublic = serverEphemeral.Public,
      salt
    };
  }

  public async Task<string?> GenerateProof(string clientProof)
  {
    var auth = await _dbContext.Auth.FirstAsync() ?? throw new Exception("Auth not found");

    var serverEphemeralSecret = auth.ServerEphemeralSecret;
    var clientPublicEphemeral = auth.ClientEphemeralPublic;

    try
    {
      var serverSession = _srpServer.DeriveSession(serverEphemeralSecret, clientPublicEphemeral, auth.Salt, "", auth.Verifier, clientProof);
      return serverSession.Proof;
    }
    catch (Exception)
    {
      return null;
    }
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

  public void EvictEphemeral()
  {
    var auth = _dbContext.Auth.FirstOrDefault();

    if (auth == null)
    {
      return;
    }

    auth.ServerEphemeralPublic = null;
    auth.ServerEphemeralSecret = null;
    auth.ClientEphemeralPublic = null;

    _dbContext.SaveChanges();
  }
}
