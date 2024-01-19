namespace Project.Models;

public class CandidateDto : CandidateDtoBase
{
    public int ID { get; set; }
    public int UserId { get; set; }

    public string Username { get; set; } = null!;

}

public class CandidateDtoAdmin : CandidateDto
{
    public string Password { get; set; } = null!;
}