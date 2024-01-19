namespace Project.Models;

public record ExamsPurchasedDto
{
    public int id { get; set; }
    public DateTime? examdate { get; set; }
    public string title { get; set; }
    public string? image { get; set; }
    public bool isTestTaken { get; set; }
}