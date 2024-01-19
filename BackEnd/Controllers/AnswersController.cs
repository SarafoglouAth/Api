using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Project.Contracts;
using Project.Models;
using Project.Services;
using System.Security.Claims;

namespace Project.Controllers;

[Authorize]
[Route("answers")]
public class AnswersController : Controller
{
    private readonly IAnswersService answersService;

    public AnswersController(IAnswersService answersService)
    {
        this.answersService = answersService;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        try
        {
            var data = answersService.GetAll();
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }


    [HttpGet("question/{questionId}")]
    public IActionResult GetForQuestion(int questionId)
    {
        try
        {
            var data = answersService.GetForQuestion(questionId);
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpPost("New")]
    public IActionResult Create([FromBody] AnswerCreateDto answer)
    {
        var claim = HttpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
        if (claim != null && int.TryParse(claim.Value, out int userId))
        {
            answersService.Create(answer, userId);
            return Ok(answer);
        }
        return Unauthorized();
    }
    [HttpGet("id")]
    public IActionResult Get(int id)
    {
        var data = answersService.GetOne(id);
        if (data == null)
        {
            return NotFound();
        }
        return Ok(data);
    }

    [HttpPut("Update")]
    public IActionResult Update([FromBody] AnswerUpdateDto answer)
    {
        try
        {
            var claim = HttpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
            if (claim != null && int.TryParse(claim.Value, out int userId))
            {

                answersService.Update(answer, userId);
                return Ok(answer);
            }
            return Unauthorized();


        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }
    [HttpDelete("Delete/{id}")]
    public IActionResult Delete(int id)
    {
        try
        {
            var claim = HttpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
            if (claim != null && int.TryParse(claim.Value, out int userId))
            {
                answersService.Delete(id, userId);
                return Ok();
            }
            return Unauthorized();
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }
}
