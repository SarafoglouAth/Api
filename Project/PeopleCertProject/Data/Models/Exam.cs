

using Data.Models.Shared;

namespace Data.Models;

public class Exam : AuditBase
{
    public string Title { get; set; } = null!;
    public float Price { get; set; }
    public string? Image { get; set; }
    public string? Description { get; set; }
    public bool IsEnabled { get; set; } = true;
    public bool IsDeleted { get; set; } = false;


    public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
    public virtual ICollection<CandidateExam> CandidateExams { get; set; } = new List<CandidateExam>();
}
