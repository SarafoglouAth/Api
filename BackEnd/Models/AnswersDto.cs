namespace Project.Models;

public record AnswerDto
{
    public int id { get; set; }
    public int QuestionId { get; set; }
    public required string Text { get; set; }
    public bool IsCorrectAnswer { get; set; }
}

public record AnswerCreateDto(int QuestionId, string Text, bool IsCorrect);
public record AnswerUpdateDto(int AnswerId, string Text, bool IsCorrect);
public record AnswerDto2(int Id, string Text, bool IsCorrect);