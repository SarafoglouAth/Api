using Microsoft.AspNetCore.Mvc;
using Project.Contracts;
using Project.Models;
using Project.Services;

namespace Project.Controllers
{
    [Route("certificates/")]
    [ApiController]
    public class CertificateController : ControllerBase
    {
        private readonly ICertificateService certificateService;

        public CertificateController(ICertificateService certificateService)
        {
            this.certificateService = certificateService;
        }
        [HttpGet("")]
        public IActionResult GetCertificates()
        {
            try
            {
                var data = certificateService.GetAll();
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("findOne")]
        public IActionResult GetCertificate(int? id, string? lastName)
        {
            try
            {
                var data = certificateService.GetOne(id,lastName);
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
        [HttpPut("{userId:int}")]
        public IActionResult UpdateCertificate([FromBody] CertificateDtoSmaller certificate, int userId)
        {  
            try
            {
               certificateService.Update(certificate,userId);
              return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpDelete("{id:int}")]
        public IActionResult DeleteCertificate(int id)
        {  
            try
            {
                certificateService.Delete(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        
    }
}