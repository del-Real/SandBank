using System.ComponentModel.DataAnnotations;

namespace SandBank.Models;

public class UserActivity
{
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    public int ActivityId { get; set; }

    [Required]
    public string Status { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = string.Empty;

    [Required]
    public DateTime AddedAt { get; set; }

    // Relations — nullable, no [Required]
    public User? User { get; set; }
    public Activity? Activity { get; set; }
}