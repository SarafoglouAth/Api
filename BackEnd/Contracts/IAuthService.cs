using Data.Models;
using Project.Models;

namespace Project.Contracts;

public interface IAuthService
{
    bool FindByName(string username);
    bool Register(RegisterModel model);
    bool ValidateLogin(string username, string password);
    (int UserId, Role? Role) GetUserInfo(string username);

}