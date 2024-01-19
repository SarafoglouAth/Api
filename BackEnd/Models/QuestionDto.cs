namespace Project.Models;

public record QuestionDto
{
    public int Id { get; set; }
    public string Text { get; set; } = null!;
    public int Type { get; set; }
    public string? Image { get; set; }
    public int ExamID { get; set; }
    public List<AnswerDto> Answers { get; set; }
}

public record QuestionCreateDto
{
    public string QuestionText { get; set; } = null!;
    public string? ImageUrl { get; set; }
    public int ExamId { get; set; }
}
public record QuestionUpdateDto
{
    public string QuestionText { get; set; } = null!;
    public string? ImageUrl { get; set; }
    public int QuestionId { get; set; }
}
public record QuestionExamDto
{
    public int Id { get; set; }
    public string TestName { get; set; } = null!;
    public List<QuestionDto> Questions { get; set; } = new();
    public record QuestionDto(int Id, string QuestionText, string? Image, string? HasPicture);
}