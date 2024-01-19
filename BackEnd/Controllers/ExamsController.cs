using Microsoft.AspNetCore.Mvc;
using Project.Contracts;
using Project.Models;
using Project.Services;

namespace Project.Controllers;

[Route("exams")]
public class ExamsController(IExamService examService, IMarkerService markerService) : Controller
{
    [HttpGet]
    public IActionResult GetAll()
    {
        try
        {
            var data = examService.GetAll();
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }
    [HttpGet("id")]
    public IActionResult Get(int id)
    {
        var data = examService.GetOne(id);
        if (data == null)
        {
            return NotFound();
        }
        return Ok(data);
    }
    [HttpPost("new")]
    public IActionResult Create([FromBody]  ExamDto exam)
    {
        examService.Create(exam);
        return Ok(exam);
    }
    [HttpPut("Update")]
    public IActionResult Update([FromBody] ExamDto exam)
    {
        try
        {
            examService.Update(exam);
            return Ok(exam);
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }
    [HttpPost("Mark")]
    public IActionResult Mark([FromBody]MarkDto mark)
    {
        try
        {
            markerService.Mark(mark);
            return Ok();
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }

    }
    [HttpDelete("Delete")]
    public IActionResult Delete(int id)
    {
        try
        {
            examService.Delete(id);
            return Ok();
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }

}
