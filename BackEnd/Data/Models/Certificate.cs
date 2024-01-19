using Data.Models.Shared;


namespace Data.Models;

public class Certificate : AuditBase
{
    public int CadidateExamsID { get; set; }
    public virtual CandidateExam CadidateExam { get; set; }

    public float PercentageScore { get; set; }
    public string AssessmentTestCode { get; set; }
    public bool AssessmentResultLabel { get; set; }
}
