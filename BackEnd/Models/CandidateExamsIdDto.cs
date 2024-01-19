namespace Project.Models;

public record CandidateExamsIdDto
{
    public int ExamId { get; set; }
    public string Title { get; set; } = null!;
    public float Price { get; set; }
    public string? Image { get; set; }
    public string? Description { get; set; }
    public bool IsPurchased { get; set; }
}
