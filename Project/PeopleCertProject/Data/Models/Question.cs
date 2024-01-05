using Data.Models.Shared;


namespace Data.Models;

public class Question : AuditBase
{
    public string Text { get; set; } = null!;
    public int Type { get; set; }
    public string? Image { get; set; }

    public int ExamID { get; set; }
    public virtual Exam Exam { get; set; }

    public bool IsDeleted { get; set; } = false;
    public bool IsLatest { get; set; } = true;

    public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();
    public virtual ICollection<CandidateExamsDetails> CandidateExamsDetails { get; set; } = new List<CandidateExamsDetails>();
}
