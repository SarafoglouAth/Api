using Data.Models.Shared;


namespace Data.Models;

public class Answer : AuditBase
{
    public int QuestionId { get; set; }
    public virtual Question Question { get; set; } = null!;

    public required string Text { get; set; }
    public bool IsCorrectAnswer { get; set; }
    public bool IsDeleted { get; set; } = false;
    public bool IsLatest { get; set; } = true;

    public virtual ICollection<CandidateExamsDetails> CandidateExamsDetails { get; set; } = new List<CandidateExamsDetails>();
}
