using Data.Models.Shared;

namespace Data.Models;

public class CandidateExam : AuditBase
{
    public int CandidateId { get; set; }
    public virtual Candidate Candidate { get; set; } = null!;

    public bool IsSuccess { get; set; }
    public DateTime ExamPurchaseDate { get; set; }
    public DateTime? ExaminationDate { get; set; }
    public bool? IsTestTaken { get; set; }

    public int? MarkedById { get; set; }
    public virtual User MarkedBy { get; set; } = null!;

    public DateTime? MarkDueDate { get; set; }
    public DateTime? MarkDate { get; set; }
    public float? ObtainedScore { get; set; }
    public float? MaximumScore { get; set; }

    public int ExamID { get; set; }
    public virtual Exam Exam { get; set; } = null!;

    public virtual ICollection<CandidateExamsDetails> CandidateExamsDetails { get; set; } = new List<CandidateExamsDetails>();
    public virtual ICollection<Certificate> Certificates { get; set; } = new List<Certificate>();
}
