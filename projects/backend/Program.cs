using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

var _corsPolicyName = "CorsPolicy";

builder.Services.AddCors(options =>
{
  options.AddPolicy(name: _corsPolicyName,
  policy =>
  {
    for (var i = 0; i < 10000; i++)
    {
      policy.WithOrigins($"http://localhost:{i}")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
        .SetIsOriginAllowed(host => true);
    }
  });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<NotesDbContext>(options =>
{
  options.UseSqlite(builder.Configuration.GetConnectionString("NotesDbContext"));
});

builder.Services.AddScoped<AuthService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(options =>
  {
    // Pulls the token from the cookie.
    options.Events = new JwtBearerEvents
    {
      OnMessageReceived = context =>
      {
        var token = context.Request.Cookies["jwt"];

        if (!string.IsNullOrEmpty(token))
        {
          context.Token = token;
        }

        return Task.CompletedTask;
      }
    };

    options.TokenValidationParameters = new TokenValidationParameters
    {
      ValidateIssuer = false,
      ValidateAudience = false,
      ValidateLifetime = false,
      ValidateIssuerSigningKey = true,
      IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new Exception("Jwt:Key is null.")))
    };
  });

var app = builder.Build();

app.UseCors(_corsPolicyName);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
