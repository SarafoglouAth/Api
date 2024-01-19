using Data;
using Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Project.Contracts;
using Project.Models;

namespace Project.Services;

public class QuestionsService : IQuestionsService
{
    private readonly PeopleCertProjectContext context;

    public QuestionsService(PeopleCertProjectContext context)
    {
        this.context = context;
    }

    public List<QuestionDto> GetQwA(int examId)
    {
        List<Question>? test = context.Questions
            .Where(b => b.ExamID == examId)
            .Where(a => a.IsDeleted == false && a.IsLatest == true)
            .Include
            (
            x => x.Answers.Where(x => x.IsDeleted == false && x.IsLatest == true)
            )
            .ToList();


        List<QuestionDto> result = test.Select(x => new QuestionDto
        {
            Id = x.Id,
            Text = x.Text,
            Type = x.Type,
            Image = x.Image,
            Answers = x.Answers.Select(a => new AnswerDto
            {
                id = a.Id,
                Text = a.Text,
                IsCorrectAnswer = a.IsCorrectAnswer
            }).ToList()
        }).ToList();

        if (test.IsNullOrEmpty())
        {
            throw new Exception("Something went bad");
        }

        return result;
    }


    public void Create(QuestionCreateDto question, int userId)
    {
        Data.Models.Question newQuestion = new Data.Models.Question()
        {
            Text = question.QuestionText,
            Type = default,
            Image = question.ImageUrl,
            ExamID = question.ExamId,
            CreatedById = userId,
            CreatedDate = DateTime.Now,
            UpdatedById = userId,
            UpdatedDate = DateTime.Now
        };

        context.Questions.Add(newQuestion);
        context.SaveChanges();
    }

    public void Delete(int id, int userId)
    {
        Data.Models.Question? question = context.Questions.FirstOrDefault(x => x.Id == id);
        if (question == null)
        {
            throw new Exception("Question not found.");
        }
        question.IsDeleted = true;
        question.IsLatest = false;
        question.UpdatedById = userId;
        question.UpdatedDate = DateTime.Now;

        context.SaveChanges();
    }

    public List<QuestionDto> GetAll()
    {
        List<Question> questions = context.Questions.Select(
            questions => new Question()
            {
                Id = questions.Id,
                Text = questions.Text,
                Type = questions.Type,
                Image = questions.Image,
                ExamID = questions.ExamID,
                IsDeleted = questions.IsDeleted,
                IsLatest = questions.IsLatest
            })
            .ToList();

        List<QuestionDto> response = new List<QuestionDto>();

        foreach (Data.Models.Question question in questions)
        {
            if (!question.IsDeleted && question.IsLatest)
            {
                response.Add(
                    new QuestionDto()
                    {
                        Id = question.Id,
                        Text = question.Text,
                        Type = question.Type,
                        Image = question.Image,
                        ExamID = question.ExamID
                    });
            }
        }
        return response;
    }

    public QuestionDto GetOne(int id)
    {
        Data.Models.Question? question = context.Questions.FirstOrDefault(x => x.Id == id);
        if (question == null)
        {
            return null;
        }
        QuestionDto result = new QuestionDto()
        {
            Id = question.Id,
            Text = question.Text,
            Type = question.Type,
            Image = question.Image,
            ExamID = question.ExamID
        };
        return result;
    }

    public void Update(QuestionUpdateDto question, int userId)
    {
        Data.Models.Question? startingQuestion = context.Questions.FirstOrDefault(x => x.Id == question.QuestionId);
        if (startingQuestion == null)
        {
            throw new Exception("Question not found.");
        }
        Data.Models.Question updatedQuestion = new Data.Models.Question()
        {
            Text = question.QuestionText,
            Image = question.ImageUrl,
            ExamID = startingQuestion.ExamID,
            CreatedById = startingQuestion.CreatedById,
            CreatedDate = startingQuestion.CreatedDate,
            UpdatedById = userId,
            UpdatedDate = DateTime.Now,
            IsLatest = true,
            Answers = startingQuestion.Answers.Select(answer => new Data.Models.Answer()
            {
                Text = answer.Text,
                IsCorrectAnswer = answer.IsCorrectAnswer,
                IsDeleted = answer.IsDeleted,
                IsLatest = true
            }).ToList()
        };

        context.Questions.Add(updatedQuestion);

        startingQuestion.IsLatest = false;

        context.SaveChanges();
    }

    public QuestionExamDto GetForExam(int examId)
    {
        var exam = context
           .Exams
           .Include(x => x.Questions.Where(x => x.IsLatest))
           .First(x => x.Id == examId);
        return new QuestionExamDto()
        {
            Id = examId,
            TestName = exam.Title,
            Questions = exam.Questions.Select(q => new QuestionExamDto.QuestionDto(q.Id, q.Text, q.Image, q.Image)).ToList()
        };
    }
}