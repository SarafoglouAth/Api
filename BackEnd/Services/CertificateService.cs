using Data;
using Project.Contracts;
using Project.Models;

namespace Project.Services;

public class CertificateService : ICertificateService
{
    private readonly PeopleCertProjectContext context;

    public CertificateService(PeopleCertProjectContext context)
    {
        this.context = context;
    }

    public List<CertificateDto> GetAll()
    {
        try
        {
            var certificatesWithExamsAndUsersAndExamTitle = context.Certificate
                .Join(
                    context.CandidateExams,
                    certificate => certificate.CadidateExamsID,
                    exam => exam.Id,
                    (certificate, exam) => new
                    {
                        Certificate = certificate,
                        CandidateExam = exam
                    }
                )
                .Where(combined=>combined.Certificate.AssessmentResultLabel)
                .Join(
                    context.Candidates,
                    combined => combined.CandidateExam.CandidateId,
                    candidate => candidate.Id,
                    (combined, candidate) => new
                    {
                        combined.Certificate,
                        combined.CandidateExam,
                        Candidate = candidate
                    }
                )
                .Join(
                    context.Exams,
                    combined => combined.CandidateExam.ExamID, 
                    exam => exam.Id,
                    (combined, exam) => new CertificateDto
                    {
                        id = combined.Certificate.Id,
                        CandidateExamsID = combined.CandidateExam.Id,
                        PercentageScore = combined.Certificate.PercentageScore,
                        AssessmentTestCode = combined.Certificate.AssessmentTestCode,
                        CandidateId = combined.CandidateExam.CandidateId,
                        FirstName = combined.Candidate.FirstName,
                        MiddleName = combined.Candidate.MiddleName,
                        LastName = combined.Candidate.LastName,
                        Tilte = exam.Title, 
                        CertificationDate = combined.CandidateExam.MarkDate
                        
                    }
                )
                .ToList();
            return certificatesWithExamsAndUsersAndExamTitle;

        }
        catch (Exception ex)
        {
            return null!;
        }


    }

    public List<CertificateDtoForUser> GetOneForCandidate(int id)
    {
        try
        {
            var candidateQuery = context.Candidates.AsQueryable();
                candidateQuery = candidateQuery.Where(candidate => candidate.Id == id);
                
    
            var candidate = candidateQuery.FirstOrDefault();

            if (candidate == null) return null; // Candidate not found
            var certificatesForCandidate = context.Certificate
                .Join(
                    context.CandidateExams,
                    certificate => certificate.CadidateExamsID,
                    exam => exam.Id,
                    (certificate, exam) => new
                    {
                        Certificate = certificate,
                        CandidateExam = exam
                    }
                )
                .Where(combined =>
                    combined.CandidateExam.CandidateId == candidate.Id &&
                    combined.Certificate.AssessmentResultLabel
                )
                .Select(combined => new CertificateDtoForUser
                {
                    id = combined.Certificate.Id,
                    PercentageScore = combined.Certificate.PercentageScore,
                    FirstName = candidate.FirstName,
                    MiddleName = candidate.MiddleName,
                    LastName = candidate.LastName,
                    Image = combined.Certificate.CadidateExam.Exam.Image,
                    Tilte = combined.Certificate.CadidateExam.Exam.Title,
                    CertificationDate = combined.CandidateExam.MarkDate
                })
                .ToList();
    
            return certificatesForCandidate;

        }
        catch (Exception ex)
        {
            return null!;
        }
    
    }
    public CertificateDto GetOne(int? id, string? lastName)
    {
        try
        {
            var candidateQuery = context.Candidates.AsQueryable();
    
            if (id.HasValue)
            {
                candidateQuery = candidateQuery.Where(candidate => candidate.Id == id);
            }
            else if (!string.IsNullOrEmpty(lastName))
            {
                candidateQuery = candidateQuery.Where(candidate => candidate.LastName == lastName);
            }
            else
            {
                // No valid id or lastName provided
                return null!;
            }
    
            var candidate = candidateQuery.FirstOrDefault();
    
            if (candidate != null)
            {
                var certificatesForCandidate = context.Certificate
                    .Join(
                        context.CandidateExams,
                        certificate => certificate.CadidateExamsID,
                        exam => exam.Id,
                        (certificate, exam) => new
                        {
                            Certificate = certificate,
                            CandidateExam = exam
                        }
                    )
                    .Where(combined =>
                        combined.CandidateExam.CandidateId == candidate.Id &&
                        combined.Certificate.AssessmentResultLabel
                    )
                    .Select(combined => new CertificateDto
                    {
                        id = combined.Certificate.Id,
                        CandidateExamsID = combined.CandidateExam.Id,
                        PercentageScore = combined.Certificate.PercentageScore,
                        AssessmentTestCode = combined.Certificate.AssessmentTestCode,
                        CandidateId = combined.CandidateExam.CandidateId,
                        FirstName = candidate.FirstName,
                        MiddleName = candidate.MiddleName,
                        LastName = candidate.LastName,
                        Tilte = combined.Certificate.CadidateExam.Exam.Title, 
                        CertificationDate = combined.CandidateExam.MarkDate
                    })
                    .FirstOrDefault();
    
                return certificatesForCandidate;
            }
    
            return null!; // Candidate not found
        }
        catch (Exception ex)
        {
            return null!;
        }
    
    }
    
    public void Delete(int id)
    {
        try
        {
            var existingCertificate = context.Certificate.FirstOrDefault(c => c.Id == id);
    
            if (existingCertificate != null)
            {
              
                context.Certificate.Remove(existingCertificate);
                context.SaveChanges();
                
            }
            else
            {
                throw new ArgumentException("Certificate not found");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            throw new Exception("Error deleting certificate");
        }
    }
}