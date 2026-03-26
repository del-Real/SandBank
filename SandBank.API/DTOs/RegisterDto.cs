using System.ComponentModel.DataAnnotations;

namespace SandBank.DTOs;

public class RegisterDto
{
    [Required]
    [MinLength(3, ErrorMessage = "Username must be at least 3 characters")]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
    public string Password { get; set; } = string.Empty;
}