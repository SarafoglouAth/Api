using Data;
using Data.Models;
using Microsoft.EntityFrameworkCore;
using Project.Contracts;
using Project.Models;

namespace Project.Services;

public class CertificateService : ICertificateService
{
    private readonly PeopleCertProject context;

    public CertificateService(PeopleCertProject context)
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
                .Join(
                    context.Candidates,
                    combined => combined.CandidateExam.CandidateId,
                    candidate => candidate.UserId,
                    (combined, candidate) => new
                    {
                        combined.Certificate,
                        combined.CandidateExam,
                        Candidate = candidate
                    }
                )
                .Join(
                    context.Exams,
                    combined => combined.CandidateExam.ExamID, // Assuming this is the foreign key to Exam table
                    exam => exam.Id,
                    (combined, exam) => new CertificateDto
                    {
                        id = combined.Certificate.Id,
                        CandidateExamsID = combined.CandidateExam.Id,
                        PercentageScore = combined.Certificate.PercentageScore,
                        AssessmentTestCode = combined.Certificate.AssessmentTestCode,
                        AssessmentResultLabel = combined.Certificate.AssessmentResultLabel,
                        IsSuccess = combined.CandidateExam.IsSuccess,
                        ExamPurchaseDate = combined.CandidateExam.ExamPurchaseDate,
                        ExaminationDate = combined.CandidateExam.ExaminationDate,
                        CandidateId = combined.CandidateExam.CandidateId,
                        FirstName = combined.Candidate.FirstName,
                        MiddleName = combined.Candidate.MiddleName,
                        LastName = combined.Candidate.LastName,
                        Tilte = exam.Title // Include the Exam title
                        // Add other properties as needed from the Exam entity
                    }
                )
                .ToList();
            return certificatesWithExamsAndUsersAndExamTitle;

        }
        catch (Exception ex)
        {
            return null;
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
                return null;
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
                        AssessmentResultLabel = combined.Certificate.AssessmentResultLabel,
                        IsSuccess = combined.CandidateExam.IsSuccess,
                        ExamPurchaseDate = combined.CandidateExam.ExamPurchaseDate,
                        ExaminationDate = combined.CandidateExam.ExaminationDate,
                        CandidateId = combined.CandidateExam.CandidateId,
                        FirstName = candidate.FirstName,
                        MiddleName = candidate.MiddleName,
                        LastName = candidate.LastName
                    })
                    .FirstOrDefault();

                return certificatesForCandidate;
            }

            return null; // Candidate not found
        }
        catch (Exception ex)
        {
            return null;
        }

    }


    public void Update(CertificateDtoSmaller certificate, int userId)
    {
        try
        {
            var existingCertificate = context.Certificate.FirstOrDefault(c => c.Id == certificate.id);

            if (existingCertificate != null)
            {
                existingCertificate.PercentageScore = certificate.PercentageScore;
                existingCertificate.AssessmentTestCode = certificate.AssessmentTestCode;
                existingCertificate.AssessmentResultLabel = certificate.AssessmentResultLabel;
                existingCertificate.CadidateExamsID = certificate.CandidateExamsID;
                // Assuming you save changes to the context
                context.SaveChanges();
            }
            else
            {
                throw new ArgumentException("Certificate not found");
            }
        }
        catch (Exception ex)
        {
            throw new Exception("Error updating certificate");
        }
    }


    public bool Delete(int id)
    {
        try
        {
            var existingCertificate = context.Certificate.FirstOrDefault(c => c.Id == id);

            if (existingCertificate != null)
            {
                // Additional authorization check (if needed)
                // For instance, verifying the user has permission to delete this record

                // Perform the deletion or mark the record as deleted
                context.Certificate.Remove(existingCertificate);
                context.SaveChanges();

                return true; // Deletion successful
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