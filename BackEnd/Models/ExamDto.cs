namespace Project.Models;

public record ExamDto
{
    public int id {  get; set; }
    public string Title { get; set; } = null!;
    public float Price { get; set; }
    public string? Image { get; set; }
    public string? Description { get; set; }
}
