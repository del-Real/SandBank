namespace SandBank.DTOs;

public class AuthResponseDto
{
    // No validation needed, this is outgoing data
    public string Token { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}