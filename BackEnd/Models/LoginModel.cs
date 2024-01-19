using System.ComponentModel.DataAnnotations;

namespace Project.Models;


public record LoginModel
{
    public required string Username { get; set; }
    public required string Password { get; set; }

    
}


public record RegisterModel
{
    [Required(ErrorMessage = "User Name is required")]
    public required string Username { get; set; }

    [Required(ErrorMessage = "Password is required")]
    public required string Password { get; set; }
}