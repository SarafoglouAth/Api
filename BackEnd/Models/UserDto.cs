using Data.Models;

namespace Project.Models;

public record UserDto
{
    public int ID { get; set; }
    public string UserName { get; set; }
    public string PassWord { get; set; }
    public Role Role { get; set; }
}

public class UserDtoWithoutId
{
    public string UserName { get; set; }
    public string PassWord { get; set; }
    public Role Role { get; set; }
}