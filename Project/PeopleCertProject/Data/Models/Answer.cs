using Data.Models.Shared;
using System.ComponentModel.DataAnnotations.Schema;


namespace Data.Models;

public class Answer : AuditBase
{
    public int QuestionId { get; set; }
    public virtual Question Question { get; set; } = null!;

    public required string Text { get; set; }
    public bool IsCorrectAnswer { get; set; }
    public bool IsDeleted { get; set; } = false;

    public virtual ICollection<CandidateExamsDetails> CandidateExamsDetails { get; set; } = new List<CandidateExamsDetails>();
}
