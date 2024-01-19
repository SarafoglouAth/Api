namespace Project.Models;

public class CertificateDto
{
    // Properties from Certificate entity
    public int id { get; set; }
    public int CandidateExamsID { get; set; }
    public float PercentageScore { get; set; }
    public string AssessmentTestCode { get; set; }

    // Properties from CandidateExam entity
    
    public int CandidateId { get; set; }
    public string Tilte { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string? MiddleName { get; set; }
    public string LastName { get; set; } = null!;
    
    public DateTime? CertificationDate { get; set; }
  
}

public class CertificateDtoForUser
{
    public int id { get; set; }
    public DateTime? CertificationDate { get; set; }
    public float PercentageScore { get; set; }
    public string Tilte { get; set; } = null!;
    public string? Image { get; set; }
    public string FirstName { get; set; } = null!;
    public string? MiddleName { get; set; }
    public string LastName { get; set; } = null!;
}