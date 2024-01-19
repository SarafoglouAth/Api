using Project.Models;

namespace Project.Contracts;

public interface ICandidateService
{
    List<CandidateDto> GetAll();
    CandidateDto? GetOne(int? id, string? lastName);

    CandidateDtoAdmin? GetForsettings(int id);
    void Create(CandidateDtoAdmin candidate);
    void Update(CandidateDtoBase candidate, string username, string password);
    void UpdateSettings(CandidateDtoAdmin candidate);
    void UpdateAdmin(CandidateDto candidate);
    void Delete(int userId);

}