using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]/[action]")]
[ApiController]
public class AuthController : Controller
{
  private readonly AuthService _authService;

  public AuthController(
    AuthService authService
  )
  {
    _authService = authService;
  }

  [HttpPost]
  public async Task<ActionResult> Start([FromBody] StartAuthRequest startAuthRequest)
  {
    var clientEphemeralPublic = startAuthRequest.ClientEphemeralPublic;
    // Validate that the auth table isn't empty.
    if (await _authService.ValidateAuthTableEmptyAsync())
    {
      return BadRequest("You need to complete setup.");
    }

    // Generate the server ephemeral.
    var result = await _authService.GenerateEphemeralAsync(clientEphemeralPublic);

    if (result == null)
    {
      return BadRequest();
    }

    return new OkObjectResult(result);
  }

  [HttpPost]
  public async Task<ActionResult> Complete([FromBody] CompleteAuthRequest completeAuthRequest)
  {
    var clientProof = completeAuthRequest.ClientProof;
    var result = await _authService.GenerateProof(clientProof);

    if (result == null)
    {
      return BadRequest();
    }

    var jwtToken = _authService.GenerateJwtToken();

    if (string.IsNullOrEmpty(jwtToken))
    {
      return BadRequest();
    }

    var cookie = new CookieOptions
    {
      HttpOnly = true,
      Secure = true,
      SameSite = SameSiteMode.Strict,
      Expires = DateTime.UtcNow.AddHours(1)
    };

    Response.Cookies.Append("jwt", jwtToken, cookie);

    return new OkObjectResult(result);
  }

  [HttpPost]
  public async Task<IActionResult> Setup([FromBody] CreateAuth auth)
  {
    if (!await _authService.ValidateAuthTableEmptyAsync())
    {
      return BadRequest();
    }

    await _authService.CreateAuthAsync(new Auth { Salt = auth.Salt, Verifier = auth.Verifier });

    return Ok();
  }

  [HttpPost]
  public async Task<IActionResult> DebugDelete()
  {
    if (!isDevelopment())
    {
      return BadRequest();
    }

    var result = await _authService.DeleteAuthAsync();

    return result ? Ok() : BadRequest();
  }

  [HttpGet]
  public IActionResult DebugTest()
  {
    if (!isDevelopment())
    {
      return BadRequest();
    }

    return Ok();
  }

  [HttpGet]
  public IActionResult DebugLogin()
  {
    if (!isDevelopment())
    {
      return BadRequest();
    }

    var jwtToken = _authService.GenerateJwtToken();

    if (string.IsNullOrEmpty(jwtToken))
    {
      return BadRequest();
    }

    var cookie = new CookieOptions
    {
      HttpOnly = true,
      Secure = true,
      SameSite = SameSiteMode.Strict,
      Expires = DateTime.UtcNow.AddHours(1)
    };

    //Check if the cookie is already set.
    if (Request.Cookies["jwt"] != null)
    {
      Response.Cookies.Delete("jwt");
    }

    Response.Cookies.Append("jwt", jwtToken, cookie);

    return Ok();
  }

  [HttpGet]
  public async Task<Boolean> VerifyHasSetup()
  {
    return await _authService.ValidateAuthTableEmptyAsync() == false;
  }

  [HttpGet]
  [Authorize]
  public IActionResult DebugSecret()
  {
    if (!isDevelopment())
    {
      return BadRequest();
    }


    return Ok("hi");
  }

  [HttpGet]
  public IActionResult Logout()
  {
    if (Request.Cookies["jwt"] != null)
    {
      Response.Cookies.Delete("jwt");
    }

    return Ok();
  }

  [HttpGet]
  [Authorize]
  public IActionResult Verify()
  {
    return Ok();
  }


  protected Boolean isDevelopment()
  {
    return Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";
  }
}
