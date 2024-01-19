using Microsoft.AspNetCore.Mvc;

using Project.Contracts;
using Project.Models;

namespace Project.Controllers;

[Route("Purchase")]
public class PurchaseController : Controller
{
    private readonly IPurchaseService purchaseService;

    public PurchaseController(IPurchaseService purchaseService)
    {
        this.purchaseService = purchaseService;
    }

    [HttpGet("Test")]
    public IActionResult GetOne(int examId, int candidateId)
    {
        try
        {
            var results = purchaseService.GetOneExam(examId, candidateId);
            return Ok(results);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetCandidateExams/{candidateId}")]
    public IActionResult GetCandidateExams(int candidateId)
    {
        var results = purchaseService.GetCandidateExams(candidateId);
        return Ok(results);
    }
    [HttpPost("LockDate")]
    public IActionResult LockDate([FromBody] LockDateDto lockDateDto)
    {
        if (lockDateDto == null)
        {
            return BadRequest("something went wrong");
        }

        purchaseService.LockDate(lockDateDto);
        return Ok();
    }

    [HttpPost("ExamCompleted")]
    public IActionResult ExamCompleted([FromBody] ExamCompletionDto examCompletionDto)
    {
        if (examCompletionDto == null)
        {
            return BadRequest("something went wrong");
        }

        purchaseService.ExamCompleted(examCompletionDto);
        return Ok();
    }

    [HttpGet("candidatespurcuses")]
    public IActionResult PurchasedExams(int candidateId)
    {
        var results = purchaseService.PurchasedExams(candidateId);
        return Ok(results);
    }

    [HttpPost("NewPurchase")]
    public IActionResult Purchase([FromBody] PurchaseDto purchaseDto)
    {
        try
        {
            purchaseService.Purchase(purchaseDto);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex);
        }
    }

}