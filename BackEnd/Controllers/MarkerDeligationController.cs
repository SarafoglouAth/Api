using Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Project.Contracts;
using Project.Models;
using Project.Services;
using System.Security.Claims;

namespace Project.Controllers
{

    [Route("MarkerDelegation/")]
    [ApiController]
    public class MarkerDelegationController : ControllerBase
    {
        private readonly IMarkerDelegationService _markerDelegationService;

        public MarkerDelegationController(IMarkerDelegationService markerDelegationService)
        {
            this._markerDelegationService = markerDelegationService;
        }

        [HttpGet]
        public IActionResult GetMarkerDelegations()
        {
            try
            {
                var data = _markerDelegationService.GetAll();
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("findOne")]
        public IActionResult GetMarkerDelegation(int id)
        {
            try
            {
                var markerDelegation = _markerDelegationService.GetOne(id);
                if (markerDelegation == null)
                {
                    return NotFound("Test Not Found"); // User not found
                }
                return Ok(markerDelegation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpPost("MarkerAssign")]
        public IActionResult MarkerAssign(MarkerDelegationDtoForMarker markerDelegationDtoForMarker )
        {
            try
            {
                _markerDelegationService.MarkerAssign(markerDelegationDtoForMarker);
                return Ok("Marker Assigned");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("MarkingBoard")]
        [Authorize]
        public IActionResult MarkingBoard()
        {
            try
            {
                var claim = HttpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
                if (claim != null && int.TryParse(claim.Value, out int userId))
                {
                    var data = _markerDelegationService.MarkingBoard(userId);
                    return Ok(data);
                }
                return Unauthorized();
               
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}

