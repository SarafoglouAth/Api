using Project.Models;

namespace Project.Contracts
{
    public interface ICandidateService
    {
        List<CandidateDto> GetAll();
        CandidateDto GetOne(int? id, string? lastName);
        void Create(CandidateDto candidate, int userId);
        void Update(CandidateDto candidate, int userId);
        bool Delete(int id, int userId);
    }
    public class CandidateDto
    {
        //placeholder
    }
}
