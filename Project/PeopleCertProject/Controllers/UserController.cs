using Data;
using Data.Models;
using Microsoft.AspNetCore.Mvc;
using Project.Models;
using Project.Services;
using Microsoft.AspNetCore.Mvc;
using Project.Contracts;

namespace Project.Controllers
    //
//
{
    [Route("/Users")]
    public class UserController : Controller
    {
        private readonly IUserService userService;

        public UserController(IUserService userService)
        {
            this.userService = userService;
        }

        
        [HttpGet("")]
        public IActionResult GetUsers()
        {
            try
            {
                var data = userService.GetAll();
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("{id:int}")]
        public IActionResult GetUser(int id)
        {
            try
            {
                var user = userService.GetOne(id);
                if (user == null)
                {
                    return NotFound(); // User not found
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        
        
        [HttpPost("")]
        public IActionResult CreateUser([FromBody] UserDtoWithoutId user)
        {
            try
            {
                if (string.IsNullOrEmpty(user.UserName) || string.IsNullOrEmpty(user.PassWord))
                {
                    return BadRequest("Username and password are required.");
                }

                userService.Create(user);
                return Ok("User created successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [HttpPut("{id:int}")]
        public IActionResult UpdateUser(int id, [FromBody] UserDtoWithoutId user)
        {
            try
            {
               userService.Update(id,user);
                return Ok("User updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            try
            {
               userService.Delete(id);
               return Ok("User deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}