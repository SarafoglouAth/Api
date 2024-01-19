namespace Project.Models;

public class LockDateDto
{
    public int ExamId { get; set; }
    public DateTime LockDate { get; set; }
    public int CandidateId { get; set; }
}