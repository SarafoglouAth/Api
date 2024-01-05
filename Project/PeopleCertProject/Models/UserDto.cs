namespace Project.Models;

public class UserDto
{
    public int ID { get; set; }
    public string UserName { get; set; }
    public string PassWord { get; set; }
    public int RoleId { get; set; }
}
public class UserDtoWithoutId
{
    public string UserName { get; set; }
    public string PassWord { get; set; }
    public int RoleId { get; set; }
}