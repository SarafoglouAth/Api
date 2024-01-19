using Data;
using Data.Models;
using Project.Contracts;
using Project.Models;

namespace Project.Services;

public class AuthService : IAuthService
{
    private readonly PeopleCertProjectContext context;

    public AuthService(PeopleCertProjectContext context)
    {
        this.context = context;
    }

    public bool FindByName(string username)
    {
        return context.Users.Any(u => u.Username == username);
    }

    public (int UserId, Role? Role) GetUserInfo(string username)
    {
        var user = context.Users.FirstOrDefault(u => u.Username == username);

        return (user!.Id, user.Role);
    }

    public bool Register(RegisterModel model)
    {
        try
        {
            var newUser = new User()
            {
                Username = model.Username,
                Password = model.Password,
                Role = Role.Candidate
            };
            context.Users.Add(newUser);
            context.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            //TODO: log
            return false;
        }
    }

    public bool ValidateLogin(string username, string password)
    {
        return context.Users
            .Any(u => u.Username == username && u.Password == password);
    }


}