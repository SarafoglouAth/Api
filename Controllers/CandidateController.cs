using Microsoft.AspNetCore.Mvc;
using Project.Contracts;
using Project.Models;
using Project.Services;

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
                var candidate = candidateService.GetOne(id,lastName);
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
        
        
        [HttpPost("")]
        public IActionResult CreateUser([FromBody] CandidateDtoWithoutId candidate, int userId)
        {
            try
            {
                if ( userId < 0 )
                {
                    return BadRequest("Insert ValidID.");
                }
        
                candidateService.Create(candidate ,userId);
                return Ok("User created successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        
        //
        [HttpPut("{userId:int}")]
        public IActionResult UpdateCandidate( [FromBody] CandidateDtoWithoutId candidate,int userId)
        {
            try
            {
               candidateService.Update(candidate ,userId);
                return Ok("User updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        
        [HttpDelete("{userId}")]
        public  IActionResult DeleteUser(int userId)
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
    }
}