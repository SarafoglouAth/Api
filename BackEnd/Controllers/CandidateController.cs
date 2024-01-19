using Microsoft.AspNetCore.Mvc;
using Project.Contracts;
using Project.Models;

namespace Project.Controllers
{
    [Route("candidates/")]
    [ApiController]
    public class CandidateController : ControllerBase
    {
        private readonly ICandidateService candidateService;

        public CandidateController(ICandidateService candidateService)
        {
            this.candidateService = candidateService;
        }

        [HttpGet("")]
        public IActionResult GetCandidates()
        {
            try
            {
                var data = candidateService.GetAll();
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("findOne")]
        public IActionResult GetCandidate(int? id, string? lastName)
        {
            try
            {
                var candidate = candidateService.GetOne(id, lastName);
                if (candidate == null)
                {
                    return NotFound("User not found"); // User not found
                }
                return Ok(candidate);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [HttpPost("Admin")]
        public IActionResult CreateUser([FromBody] CandidateDtoAdmin candidate)
        {
            try
            {

                candidateService.Create(candidate);
                return Ok("User created successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [HttpPut("{userId:int}")]
        public IActionResult UpdateCandidate([FromBody] CandidateDtoBase candidate, string username, string password)
        {
            try
            {
                candidateService.Update(candidate, username, password);
                return Ok("User updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpPut("Admin")]
        public IActionResult UpdateCandidateAdmin([FromBody] CandidateDto candidate)
        {
            try
            {
                candidateService.UpdateAdmin(candidate);
                return Ok("User updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("{userId}")]
        public IActionResult DeleteUser(int userId)
        {
            try
            {
                candidateService.Delete(userId);
                return Ok("User deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("settings/{userId:int}")]
        public IActionResult UpdateSettings([FromBody] CandidateDtoAdmin candidate)
        {
            try
            {
                candidateService.UpdateSettings(candidate);
                return Ok("User updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("{userId}")]
        public IActionResult GetSettings(int userId)
        {
            try
            {
                var data = candidateService.GetForsettings(userId);
                if (data == null)
                {
                    return NotFound("User not found"); // User not found
                }
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

    }
}