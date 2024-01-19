using Data.Models.Shared;


namespace Data.Models;

public class CandidateExamsDetails : EntityKey
{
    public int CadidateID { get; set; }
    public virtual Candidate Candidate { get; set; } = null!;

    public int CandidateExamID { get; set; }
    public virtual CandidateExam CandidateExam { get; set; } = null!;

    public int QuestionId { get; set; }
    public virtual Question Question { get; set; } = null!;

    public int AnswerID { get; set; }
    public virtual Answer Answer { get; set; } = null!;

    public bool IsAnswerGivenByCandidate { get; set; }
}
