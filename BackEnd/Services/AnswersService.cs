using Data;
using Data.Models;
using Project.Contracts;
using Project.Models;

namespace Project.Services;


public class AnswersService : IAnswersService
{
    private readonly PeopleCertProjectContext context;

    public AnswersService(PeopleCertProjectContext context)
    {
        this.context = context;
    }

    public void Create(AnswerCreateDto answer, int userId)
    {
        Data.Models.Answer newAnswer = new Data.Models.Answer()
        {
            QuestionId = answer.QuestionId,
            Text = answer.Text,
            IsCorrectAnswer = answer.IsCorrect,
            CreatedById = userId,
            CreatedDate = DateTime.Now,
            UpdatedById = userId,
            UpdatedDate = DateTime.Now
        };

        context.Answers.Add(newAnswer);
        if (answer.IsCorrect)
        {
            var otherQuestionAnswers = context.Answers.Where(x => x.QuestionId == answer.QuestionId && x.IsLatest && !x.IsDeleted).ToList();
            foreach (var otherQuestionAnswer in otherQuestionAnswers)
            {
                otherQuestionAnswer.IsCorrectAnswer = false;
            }
        }
        context.SaveChanges();
    }

    public void Delete(int id, int userId)
    {
        Data.Models.Answer? answer = context.Answers.FirstOrDefault(x => x.Id == id);
        if (answer == null)
        {
            throw new Exception("Answer not found.");
        }
        if (answer.IsCorrectAnswer)
        {
            throw new Exception("Correct answer cannot be deleted");
        }
        answer.IsDeleted = true;
        answer.IsLatest = false;
        answer.UpdatedById = userId;
        answer.UpdatedDate = DateTime.Now;

        context.SaveChanges();
    }

    public List<AnswerDto> GetAll()
    {
        List<Answer> answers = context.Answers.Select(
            answers => new Answer()
            {
                Id = answers.Id,
                QuestionId = answers.QuestionId,
                Text = answers.Text,
                IsCorrectAnswer = answers.IsCorrectAnswer,
                IsDeleted = answers.IsDeleted,
                IsLatest = answers.IsLatest
            }
            ).ToList();
        List<AnswerDto> response = new List<AnswerDto>();
        foreach (var answer in answers)
        {
            if (!answer.IsDeleted && answer.IsLatest)
            {
                response.Add(
                    new AnswerDto()
                    {
                        id = answer.Id,
                        QuestionId = answer.QuestionId,
                        Text = answer.Text,
                        IsCorrectAnswer = answer.IsCorrectAnswer
                    });
            }
        }
        return response;
    }

    public List<AnswerDto2> GetForQuestion(int questionId)
    {
        List<AnswerDto2> answers = context.Answers.Where(x => x.QuestionId == questionId && x.IsLatest && !x.IsDeleted).Select(
          answer => new AnswerDto2(answer.Id, answer.Text, answer.IsCorrectAnswer))
            .ToList();
        return answers;
    }

    public AnswerDto GetOne(int id)
    {
        Data.Models.Answer? answer = context.Answers.FirstOrDefault(x => x.Id == id);
        if (answer == null)
        {
            return null;
        }
        AnswerDto result = new AnswerDto()
        {
            id = answer.Id,
            QuestionId = answer.QuestionId,
            Text = answer.Text,
            IsCorrectAnswer = answer.IsCorrectAnswer
        };

        return result;
    }

    public void Update(AnswerUpdateDto answer, int userId)
    {
        Data.Models.Answer? statingAnswer = context.Answers.FirstOrDefault(x => x.Id == answer.AnswerId);
        if (statingAnswer == null)
        {
            throw new Exception("Answer not found.");
        }
        Data.Models.Answer updatedAnswer = new Data.Models.Answer()
        {
            Text = answer.Text,
            IsCorrectAnswer = answer.IsCorrect,
            QuestionId = statingAnswer.QuestionId,
            CreatedById = statingAnswer.CreatedById,
            CreatedDate = statingAnswer.CreatedDate,
            UpdatedById = userId,
            UpdatedDate = DateTime.Now
        };

        if (answer.IsCorrect)
        {
            var otherQuestionAnswers = context.Answers.Where(x => x.QuestionId == statingAnswer.QuestionId && x.IsLatest && !x.IsDeleted).ToList();
            foreach (var otherQuestionAnswer in otherQuestionAnswers)
            {
                otherQuestionAnswer.IsCorrectAnswer = false;
            }
        }

        context.Answers.Add(updatedAnswer);

        statingAnswer.IsLatest = false;
        context.SaveChanges();
    }
}