using Data;
using Data.Models;
using Project.Contracts;
using Project.Models;

namespace Project.Services;


public class UserService : IUserService
{
    private readonly PeopleCertProjectContext context;

    public UserService(PeopleCertProjectContext context)
    {
        this.context = context;
    }


    public List<UserDto> GetAll()
    {
        try
        {
            List<UserDto> users = context.Users
                .Select(user => new UserDto()
                {
                    ID = user.Id,
                    UserName = user.Username,
                    PassWord = user.Password,
                    Role = user.Role
                })
                .ToList();


            return users;

        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }

    }

    public UserDto GetOne(int id)
    {
        try
        {
            var user = context.Users.FirstOrDefault(u => u.Id == id);
            if (user == null)
            {
                return null; // User not found
            }

            // Map user entity to UserDto
            var userDto = new UserDto()
            {
                ID = user.Id,
                UserName = user.Username,
                PassWord = user.Password,
                Role = user.Role
            };

            return userDto;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public GetFromUsernameDto? GetIdFromUsername(string username)
    {
        try
        {
            var user = context.Users.FirstOrDefault(u => u.Username == username);

            if (user == null)
            {
                throw new ArgumentException("didnt find the guy.");
            }

            if (user.Role == Role.Candidate)
            {
                var candidate = context.Candidates.FirstOrDefault(c => c.UserId == user.Id);
                if (candidate == null)
                {
                    throw new ArgumentException("didnt find the guy.");
                }

                var userDto = new GetFromUsernameDto()
                {
                    UserId = user.Id,
                    CandidateId = candidate.Id
                };
                return userDto;
            }

            var userDto2 = new GetFromUsernameDto()
            {
                UserId = user.Id,
                CandidateId = null
            };
            return userDto2;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }


    public void Create(UserDtoWithoutId user)
    {
        try
        {
            if (string.IsNullOrEmpty(user.UserName) || string.IsNullOrEmpty(user.PassWord))
            {
                throw new ArgumentException("Username and password are required.");
            }

            if (user.Role < 0)
            {
                throw new ArgumentException("Invalid Role ID.");
            }

            if (context.Users.Any(x => x.Username == user.UserName))
            {
                throw new InvalidOperationException("User already exists.");
            }

            var newUser = new User()
            {
                Username = user.UserName,
                Password = user.PassWord,
                Role = user.Role,
                CreatedDate = DateTime.Now,
                CreatedById = 1, // Replace with the appropriate logic to get the creator's ID
                UpdatedById = 1, // Replace with the appropriate logic to get the updater's ID
                UpdatedDate = DateTime.Now
            };

            context.Users.Add(newUser);
            context.SaveChanges();
        }
        catch (ArgumentException ex)
        {
            throw new ArgumentException(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            throw new InvalidOperationException(ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
        
    }

    public void Update(int userId, UserDtoWithoutId user)
    {
        try
        {
            if (userId < 0)
            {
                throw new ArgumentException("Invalid user ID.");
            }

            var existingUser = context.Users.FirstOrDefault(u => u.Id == userId);
            if (existingUser != null)
            {
                if (string.IsNullOrEmpty(user.UserName) || string.IsNullOrEmpty(user.PassWord))
                {
                    throw new ArgumentException("Username and password are required.");
                }

                // Check if the username is already taken by another user
                var otherUserWithSameName = context.Users.FirstOrDefault(u => u.Username == user.UserName && u.Id != userId);
                if (otherUserWithSameName != null)
                {
                    throw new InvalidOperationException("Username is already in use by another user.");
                }

                // Update user entity properties
                existingUser.Username = user.UserName;
                existingUser.Password = user.PassWord;
                existingUser.Role = user.Role;

                context.SaveChanges();
            }
            else
            {
                throw new InvalidOperationException("User not found.");
            }
        }
        catch (ArgumentException ex)
        {
            throw new ArgumentException(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            throw new InvalidOperationException(ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public void Delete(int id)
    {
        try
        {
            if (id < 0)
            {
                throw new ArgumentException("Invalid user ID.");
            }

            var userToDelete = context.Users.FirstOrDefault(u => u.Id == id);
            if (userToDelete != null)
            {
                // Perform any additional validations here (e.g., authorization check, cascading delete)

                context.Users.Remove(userToDelete);
                context.SaveChanges();
            }
            else
            {
                throw new InvalidOperationException("User not found.");
            }
        }
        catch (ArgumentException ex)
        {
            throw new ArgumentException(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            throw new InvalidOperationException(ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }
}