namespace Project.Contracts
{
    public interface ICertificateService
    {
        List<CertificateDto> GetAll();
        CertificateDto GetOne(int? id, string? lastName);
        void Create(CertificateDto certificate, int userId);
        void Update(CertificateDto certificate, int userId);
        bool Delete(int id, int userId);
    }
    public class CertificateDto
    {
        //placeholder
    }
}
