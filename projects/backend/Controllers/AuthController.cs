using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/v1/[controller]/[action]")]
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
  public async Task<ActionResult> Start([FromBody] string clientEphemeralPublic)
  {
    // Validate that the auth table isn't empty.
    if (await _authService.ValidateAuthTableEmptyAsync())
    {
      return BadRequest("You need to complete setup.");
    }

    // Validate that the client's ephemeral does not exist and that the input is "valid".
    if (_authService.ValidateEphermeralExists() || string.IsNullOrEmpty(clientEphemeralPublic))
    {
      return BadRequest();
    }

    // Generate the server ephemeral.
    var result = _authService.GenerateEphemeralAsync(clientEphemeralPublic);

    if (result == null)
    {
      return BadRequest();
    }

    return new OkObjectResult(result);
  }

  [HttpPost]
  public ActionResult Complete([FromBody] Auth auth)
  {
    if (!_authService.ValidateEphermeralExists())
    {
      return BadRequest();
    }

    return Ok();
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
  public IActionResult ValidateSignedIn()
  {
    return Ok();
  }


  protected Boolean isDevelopment()
  {
    return Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";
  }
}
