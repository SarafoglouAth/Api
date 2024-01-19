using Data.Models;
using Project.Models;

namespace Project.Contracts;

public interface IQuestionsService
{
    List<QuestionDto> GetAll();
    QuestionDto GetOne(int id);
    void Create(QuestionCreateDto question, int userId);
    void Update(QuestionUpdateDto question, int userId);
    void Delete(int id, int userId);
    List<QuestionDto> GetQwA(int examId);
    QuestionExamDto GetForExam(int examId);
}