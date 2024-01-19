using Data.Models;

using Project.Models;
using Project.Services;
using static Project.Services.PurchaseService;

namespace Project.Contracts;

public interface IPurchaseService
{
    void Purchase(PurchaseDto purchaseDto);
    List<ExamsPurchasedDto> PurchasedExams(int candidateId);
    
    void LockDate(LockDateDto lockDateDto);
    void ExamCompleted(ExamCompletionDto examCompletionDto);
    List<CandidateExamsIdDto> GetCandidateExams(int candidateId);
    List<Test> GetOneExam(int examId, int candidateId);
}