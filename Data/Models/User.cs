using Data.Models.Shared;
using Microsoft.AspNetCore.Identity;

namespace Data.Models;

public class User : EntityKey
{
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
    public int RoleID { get; set; } //Καθορίζει δικαιώματα

    public int CreatedById { get; set; }
    public int UpdatedById { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }


    public virtual Candidate? Candidate { get; set; }
    public virtual ICollection<Candidate> CandidatesCreatedBy { get; set; } = new List<Candidate>();
    public virtual ICollection<Candidate> CandidatesLastUpdatedBy { get; set; } = new List<Candidate>();
    public virtual ICollection<Exam> ExamsCreatedBy { get; set; } = new List<Exam>();
    public virtual ICollection<Exam> ExamsLastUpdatedBy { get; set; } = new List<Exam>();
    public virtual ICollection<Question> QuestionCreatedBy { get; set; } = new List<Question>();
    public virtual ICollection<Question> QuestionsUpdatedBy { get; set; } = new List<Question>();
    public virtual ICollection<Answer> AnswersCreatedBy { get; set; } = new List<Answer>();
    public virtual ICollection<Answer> AnswersUpdatedBy { get; set; } = new List<Answer>();
    public virtual ICollection<CandidateExam> CandidateExams { get; set; } = new List<CandidateExam>();
    public virtual ICollection<CandidateExam> CandidateExamsCreatedBy { get; set; } = new List<CandidateExam>();
    public virtual ICollection<CandidateExam> CandidateExamsUpdatedBy { get; set; } = new List<CandidateExam>();
    public virtual ICollection<Certificate> CertificateCreatedBy { get; set; } = new List<Certificate>();
    public virtual ICollection<Certificate> CertificateUpdatedBy { get; set; } = new List<Certificate>();

}
