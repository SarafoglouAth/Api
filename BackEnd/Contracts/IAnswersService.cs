using Project.Models;

namespace Project.Contracts
{
    public interface IAnswersService
    {
        List<AnswerDto> GetAll();
        AnswerDto GetOne(int id);
        void Create(AnswerCreateDto answer, int userId);
        void Update(AnswerUpdateDto answer, int userId);
        void Delete(int id, int userId);
        List<AnswerDto2> GetForQuestion(int questionId);
        
    }

}