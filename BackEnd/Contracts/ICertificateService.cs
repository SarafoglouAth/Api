using Project.Models;

namespace Project.Contracts
{
    public interface ICertificateService
    {
        List<CertificateDto> GetAll();
        CertificateDto GetOne(int? id, string? lastName);

        List<CertificateDtoForUser> GetOneForCandidate(int id);
        void Delete(int id);
    }
}
