using Data.Models;
using Project.Models;

namespace Project.Contracts
{
    public interface IPurchaseService
    {
        Test GetOne(int id);
        void Purchase(int id);
        void Schedule(int id);
        CandidateExamDetailsDto ExamCompleted(CandidateExamsDetails candidateExamsDetails);

    }
    public record Test
    {
        //placeholder
    }
    public record CandidateExamDetailsDto
    {
        //placeholder
    }
}
