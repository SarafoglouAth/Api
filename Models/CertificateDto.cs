using Project.Contracts;

namespace Project.Models;

public class CertificateDto
{
    // Properties from Certificate entity
    public int id { get; set; }
    public int CandidateExamsID { get; set; }
    public float PercentageScore { get; set; }
    public string AssessmentTestCode { get; set; }
    public bool AssessmentResultLabel { get; set; }

    // Properties from CandidateExam entity
    public bool IsSuccess { get; set; }
    
    public int CandidateId { get; set; }
    public string Tilte { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string? MiddleName { get; set; }
    public string LastName { get; set; } = null!;
    public DateTime ExamPurchaseDate { get; set; }
    public DateTime? ExaminationDate { get; set; }
    
    public DateTime CertificationDate { get; set; }
  
}

public class CertificateDtoSmaller
{
    public int id { get; set; }
    public int CandidateExamsID { get; set; }
    public float PercentageScore { get; set; }
    public string AssessmentTestCode { get; set; }
    public bool AssessmentResultLabel { get; set; }
}