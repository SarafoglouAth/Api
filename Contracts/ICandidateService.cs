using Project.Models;

namespace Project.Contracts
{
    public interface ICandidateService
    {
        List<CandidateDto> GetAll();
        CandidateDto? GetOne(int? id, string? lastName);
        void Create(CandidateDtoWithoutId candidate, int userId);
        void Update(CandidateDtoWithoutId candidate, int userId);
        void Delete( int userId);
    }
   
}
