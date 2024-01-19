
namespace Project.Models;

public class ExamCompletionDto
{
    public int CandidateId { get; set; }
    public int ExamId { get; set; }

    public List<int> AnswerIDs { get; set; }
    public List<int> SelectedAnswerIDs { get; set; }
}
