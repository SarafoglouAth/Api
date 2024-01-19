using Project.Models;

namespace Project.Contracts;

public interface IUserService
{
    List<UserDto> GetAll();
    
    UserDto GetOne(int id);
    
    GetFromUsernameDto? GetIdFromUsername(string username);
    void Create(UserDtoWithoutId user /*Admin user id, not user to be created*/);
    void Update(int userId, UserDtoWithoutId user /*Admin user id, not user to be created*/);
    void Delete(int userId /*Admin user id, not user to be created*/);
}
