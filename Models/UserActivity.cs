namespace SandBank.Models;

public class UserActivity
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int ActivityId { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime AddedAt { get; set; }

    // Relations
    public User? User { get; set; }
    public Activity? Activity { get; set; }
}