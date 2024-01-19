using Data;
using Data.Models;
using Microsoft.EntityFrameworkCore;
using Project.Contracts;
using Project.Models;
using static Project.Models.Test;

namespace Project.Services;

public class MarkerService(PeopleCertProjectContext context) : IMarkerService
{
    public void Mark(MarkDto markDto)
    {
        var exam = context.CandidateExams.Find(markDto.CandidateExamId);

        if (exam == null)
        {
            throw new Exception("CandidateExam does not exist");
        }

        exam.ObtainedScore = markDto.ObtainedScore;
        exam.MarkDate = DateTime.Now;
        exam.MaximumScore = 100;
        exam.IsSuccess = markDto.ObtainedScore >= 65;

        // Create Certificate 
        if (exam.IsSuccess)
        {
            var certificate = new Certificate()
            {
                CadidateExamsID = markDto.CandidateExamId,
                PercentageScore = (float)markDto.ObtainedScore,
                AssessmentResultLabel = true,
                AssessmentTestCode = "1",
                CreatedById = 1,
                CreatedDate = DateTime.Now,
                UpdatedById = 1,
                UpdatedDate = DateTime.Now

            };
            context.Certificate.Add(certificate);
        }

        
        context.SaveChanges();
    }

    public List<Test> GetExamToMark(int examId, int candidateId)
    {
        var candidateExam = context.CandidateExams
            .Include(x => x.CandidateExamsDetails)
                .ThenInclude(x => x.Question)
            .Include(x => x.CandidateExamsDetails)
                .ThenInclude(x => x.Answer)
            .Include(x => x.Exam)
            .AsSplitQuery()
            .AsNoTracking()
            .FirstOrDefault(x => x.ExamID == examId && x.CandidateId == candidateId);

        if (candidateExam == null)
        {
            throw new Exception("Test not available");
        }

        Test result = new Test()
        {
            ExamId = candidateExam.ExamID,
            CandidateExamId = candidateExam.Id,
            Description = candidateExam.Exam.Description,
            Image = candidateExam.Exam.Image,
            Price = candidateExam.Exam.Price,
            Title = candidateExam.Exam.Title,
            ExamDate = candidateExam.ExaminationDate ?? DateTime.Now,
            Questions = new List<Test.Question>()
        };

        foreach (var candidateExamsDetailGroup in candidateExam.CandidateExamsDetails.GroupBy(x => x.QuestionId))
        {
            var dbQuestion = candidateExamsDetailGroup.First().Question;

            var question = new Test.Question()
            {
                Id = candidateExamsDetailGroup.Key, //questionid
                Text = dbQuestion.Text,
                HasPicture = dbQuestion.Image,
                Answers = new List<Test.Answer>()
            };
            foreach (var answer in candidateExamsDetailGroup)
            {
                if (answer.IsAnswerGivenByCandidate)
                {
                    question.UserAnswer = answer.AnswerID;
                }
                question.Answers.Add(new Test.Answer()
                {
                    Id = answer.AnswerID,
                    Text = answer.Answer.Text,
                    IsCorrect = answer.Answer.IsCorrectAnswer
                });
            }

            result.Questions.Add(question);
        }

        return new List<Test>() { result };
    }
    
}

