using Data;
using Data.Models;
using Microsoft.EntityFrameworkCore;
using Project.Contracts;
using Project.Models;
using static Project.Models.Test;
using static System.Net.Mime.MediaTypeNames;

namespace Project.Services;

public class ExamService : IExamService
{
    private readonly PeopleCertProjectContext context;

    public ExamService(PeopleCertProjectContext context)
    {
        this.context = context;
    }

    public void Create(ExamDto exam)
    {

        Exam newExam = new Exam()
        {
            Title = exam.Title,
            Image = exam.Image,
            Price = exam.Price,
            IsEnabled = true,
            Description = exam.Description,
            CreatedById = 3,
            CreatedDate = DateTime.Now,
            UpdatedById = 3,
            UpdatedDate = DateTime.Now
        };
        context.Exams.Add(newExam);
        context.SaveChanges();

    }

    public void Delete(int id)
    {
        Exam? exam = context.Exams.FirstOrDefault(x => x.Id == id);
        if (exam == null)
        {
            throw new Exception("Exam not found.");
        }

        exam.IsDeleted = true;
        exam.UpdatedById = 3;
        exam.UpdatedDate = DateTime.Now;

        context.SaveChanges();
    }

    public List<ExamDto> GetAll()
    {
        List<ExamDto> response = context.Exams
            .Where(exam => exam.IsEnabled && !exam.IsDeleted)
            .Select(exam => new ExamDto
            {
                id = exam.Id,
                Title = exam.Title,
                Description = exam.Description,
                Image = exam.Image,
                Price = exam.Price
            })
            .ToList();

        return response;
    }


    public ExamDto GetOne(int id)
    {
        Exam? exam = context.Exams.FirstOrDefault(x => x.Id == id);
        if (exam == null)
        {
            return null;
        }
        ExamDto result = new ExamDto()
        {
            id = exam.Id,
            Title = exam.Title,
            Description = exam.Description,
            Image = exam.Image,
            Price = exam.Price
        };

        return result;
    }

    public void Update(ExamDto exam)
    {
        Exam? startingExam = context.Exams
            .Include(x => x.Questions)
                .ThenInclude(x => x.Answers)            
            .FirstOrDefault(x => x.Id == exam.id);        

        if (startingExam == null)
        {
            throw new Exception("Exam not found.");
        }
        Exam updatedExam = new Exam()
        {
            Title = exam.Title,
            Price = exam.Price,
            Image = exam.Image,
            Description = exam.Description,
            CreatedById = startingExam.CreatedById,
            CreatedDate = startingExam.CreatedDate,
            UpdatedById = 3,
            UpdatedDate = DateTime.Now,
            Questions = startingExam.Questions.Select(question => new Data.Models.Question()
            {
                Text = question.Text,
                Type = question.Type,
                Image = question.Image,
                ExamID = question.ExamID,
                Exam = question.Exam,
                IsDeleted = question.IsDeleted,
                IsLatest = true,
                Answers = question.Answers.Select(answer => new Data.Models.Answer()
                {
                    Text = answer.Text,
                    IsCorrectAnswer = answer.IsCorrectAnswer,
                    IsDeleted = answer.IsDeleted,
                    IsLatest = true
                }).ToList(),
                //CandidateExamsDetails = candidateExamsDetails;

            }).ToList()

        };

        context.Exams.Add(updatedExam);
        startingExam.IsEnabled = false;

        context.SaveChanges();
    }
}
