using Data.Models;

namespace Project.Models;

public record ExamToMarkDto
{
    public string TestName { get; set; } 
    public int TestId { get; set; }
    public DateTime ExamDate { get; set; }
    public List<QuestionForMarking> Questions { get; set; } = null!;
   
   }

public record SelectedAnswerIds
{
    public int AnswerId { get; set; }
}
 
public record QuestionForMarking
{
    public int id { get; set; }
    public string QuestionText { get; set; } = null!;
    public string? HasPicture { get; set; }
    public int? UserAnswer { get; set; }
    public List<AnswerForMarking> Answers { get; set; } = null!;
}

public record AnswerForMarking
{
    public int id { get; set; }
    public string text { get; set; }
    public bool isCorrect { get; set; }
}