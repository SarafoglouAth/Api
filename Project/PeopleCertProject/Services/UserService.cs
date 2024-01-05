using Data;
using Data.Models;
using Microsoft.AspNetCore.Mvc;
using Project.Contracts;
using Project.Models;

namespace Project.Services
{

    public class UserService : IUserService
    {
        private readonly PeopleCertProject context;

        public UserService(PeopleCertProject context)
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
                        RoleId = user.RoleID
                    })
                    .ToList();
                

                return users;
                
            }catch(Exception ex)
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
                    RoleId = user.RoleID
                };

                return userDto;
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

                if (user.RoleId < 0)
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
                    RoleID = user.RoleId,
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
                    existingUser.RoleID = user.RoleId;

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
}