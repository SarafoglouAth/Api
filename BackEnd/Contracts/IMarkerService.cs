using Data.Models;
using Project.Models;

namespace Project.Contracts;

public interface IMarkerService
{
    void  Mark(MarkDto markDto);
    
    List<Test> GetExamToMark(int examId, int candidateId);
}