namespace Project.Contracts
{
    public interface IQuestionsService
    {
        List<QuestionDto> GetAll();
        QuestionDto GetOne(int id);
        void Create(QuestionDto question, int userId);
        void Update(QuestionDto question, int userId);
        bool Delete(int id, int userId);
    }
    public record QuestionDto
    {
        //placeholder
    }
}

