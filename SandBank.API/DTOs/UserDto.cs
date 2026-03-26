namespace SandBank.DTOs;

public class UserDto
{
    // No validation needed, outgoing data
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}