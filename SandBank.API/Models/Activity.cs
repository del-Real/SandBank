using System.ComponentModel.DataAnnotations;

namespace SandBank.Models;

public class Activity
{
    public int Id { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public int Duration { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }  // nullable = NOT required
}