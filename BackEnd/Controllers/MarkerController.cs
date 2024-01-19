using Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Project.Contracts;
using Project.Models;
using System.Security.Claims;
using static Project.Models.Test;

namespace Project.Controllers;

[Route("Marker")]
public class MarkerController : ControllerBase
{
    private readonly IMarkerService _markerService;

    public MarkerController(IMarkerService markerService)
    {
        _markerService = markerService;
    }


    [HttpGet("GetExamToMark")]
    public IActionResult GetExamToMark(int examId, int candidateId)
    {
        try
        {
            var result = _markerService.GetExamToMark(examId, candidateId);
            return Ok(result);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

}









