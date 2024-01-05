using Data.Models;
using Project.Models;


namespace Project.Contracts
{
    public interface ICertificateService
    {
        List<CertificateDto> GetAll();
        CertificateDto GetOne(int? id, string? lastName);
        
        void Update(CertificateDtoSmaller certificate, int userId);
        bool Delete(int id);
    }
   
}
