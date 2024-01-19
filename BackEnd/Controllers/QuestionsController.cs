using Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Project.Contracts;
using Project.Models;
using System.Security.Claims;
using static Project.Models.Test;

namespace Project.Controllers;

[Route("questions")]
[Authorize]
public class QuestionsController : Controller
{
    private readonly IQuestionsService questionsService;

    public QuestionsController(IQuestionsService questionsService)
    {
        this.questionsService = questionsService;
    }

    [HttpGet("questionswithanswer")]
    public IActionResult GetQwA(int examId)
    {
        try
        {
            List<QuestionDto> result = questionsService.GetQwA(examId);
            return Ok(result);

        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }

    }


    [HttpGet]
    public IActionResult GetAll()
    {
        try
        {
            var data = questionsService.GetAll();
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }
    [HttpGet("exam/{examId}")]
    public IActionResult GetForExam(int examId)
    {
        var data = questionsService.GetForExam(examId);
        if (data == null)
        {
            return NotFound();
        }
        return Ok(data);
    }
    [HttpGet("id")]
    public IActionResult Get(int id)
    {
        var data = questionsService.GetOne(id);
        if (data == null)
        {
            return NotFound();
        }
        return Ok(data);
    }

    [HttpPost("New")]
    public IActionResult Create([FromBody] QuestionCreateDto question)
    {
        var claim = HttpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
        if (claim != null && int.TryParse(claim.Value, out int userId))
        {
            questionsService.Create(question, userId);
            return Ok(question);
        }

        return Unauthorized();
    }

    [HttpPut("Update")]
    public IActionResult Update([FromBody] QuestionUpdateDto question)
    {
        try
        {
            var claim = HttpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
            if (claim != null && int.TryParse(claim.Value, out int userId))
            {
                questionsService.Update(question, userId);
                return Ok(question);
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
                questionsService.Delete(id, userId);
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