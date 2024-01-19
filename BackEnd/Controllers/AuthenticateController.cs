using Azure;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Project.Contracts;
using Project.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Project.Controllers;


[Route("api/[controller]")]
[ApiController]
public class AuthenticateController : ControllerBase
{

    private readonly IAuthService _authService;
    private readonly IConfiguration _configuration;

    public AuthenticateController(
        IConfiguration configuration, IAuthService authService)
    {
        _configuration = configuration;
        _authService = authService;
    }

    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login(LoginModel model)
    {
        if (_authService.ValidateLogin(model.Username, model.Password))
        {
            (int userId, Data.Models.Role? userRole) = _authService.GetUserInfo(model.Username);

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, model.Username),
                new Claim(ClaimTypes.Role, userRole.ToString()),
                new Claim(ClaimTypes.Sid, userId.ToString())
            };

            var token = GetToken(authClaims);

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo
            });
        }
        return Unauthorized();
    }

    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> Register(RegisterModel model)
    {
        var userExists = _authService.FindByName(model.Username);
        if (userExists)
        {
            return BadRequest("User already exists");
        }
        var registrationResult = _authService.Register(model);
        if (!registrationResult)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { Status = "Error", Message = "User could not be registerd" });
        }

        return Created();
    }

    private JwtSecurityToken GetToken(List<Claim> authClaims)
    {
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

        var token = new JwtSecurityToken(
            issuer: _configuration["JWT:ValidIssuer"],
            audience: _configuration["JWT:ValidAudience"],
            expires: DateTime.Now.AddHours(3),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

        return token;
    }
}