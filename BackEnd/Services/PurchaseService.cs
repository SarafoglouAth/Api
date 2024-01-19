using Data;
using Data.Models;

using Microsoft.EntityFrameworkCore;
using Project.Contracts;
using Project.Models;


namespace Project.Services;

public class PurchaseService : IPurchaseService
{
    private readonly PeopleCertProjectContext context;

    public PurchaseService(PeopleCertProjectContext context)
    {
        this.context = context;
    }

    public void LockDate(LockDateDto lockDateDto)
    {
        var candidateExam = context.CandidateExams
            .Include(x => x.Exam)
            .FirstOrDefault(x => x.ExamID == lockDateDto.ExamId && x.CandidateId == lockDateDto.CandidateId);

        if (candidateExam == null)
        {
            throw new Exception("candidate is not entitled to exam");
        }

        candidateExam.ExaminationDate = lockDateDto.LockDate;
        context.SaveChanges();
    }

    public void ExamCompleted(ExamCompletionDto examCompletionDto)
    {

        var answers = context.Answers.Where(x => examCompletionDto.AnswerIDs.Contains(x.Id)).ToList();

        var candicateExam = context.CandidateExams.First(x =>
        x.ExamID == examCompletionDto.ExamId &&
        x.CandidateId == examCompletionDto.CandidateId);

        foreach (var answerId in examCompletionDto.AnswerIDs)
        {
            var candidateExamsDetails = new CandidateExamsDetails()
            {
                CandidateExamID = candicateExam.Id,
                CadidateID = examCompletionDto.CandidateId,
                AnswerID = answerId,
                IsAnswerGivenByCandidate = examCompletionDto.SelectedAnswerIDs.Contains(answerId),
                QuestionId = answers.First(x => x.Id == answerId).QuestionId
            };

            context.CandidateExamsDetails.Add(candidateExamsDetails);
        }

        //find the exam in candidateexams and true is test taken
        var testTakenUpdate = context.CandidateExams
        .SingleOrDefault(c => c.ExamID == examCompletionDto.ExamId && c.CandidateId == examCompletionDto.CandidateId);
        testTakenUpdate.IsTestTaken = true;


        context.SaveChanges();
    }

    public List<Test> GetOneExam(int examId, int candidateId)
    {
        var exam = context.Exams
            .Include(x => x.CandidateExams)
            .Include(x => x.Questions)
                .ThenInclude(x => x.Answers)
            .FirstOrDefault(x => x.Id == examId && x.CandidateExams.Any(c => c.CandidateId == candidateId));

        if (exam == null)
        {
            //candidate is not entitled to exam
            throw new Exception("candidate is not entitled to exam");
        }

        Test result = new Test()
        {
            ExamId = exam.Id,
            Description = exam.Description,
            Image = exam.Image,
            Price = exam.Price,
            Title = exam.Title,
            ExamDate = DateTime.Now,
            Questions = new List<Test.Question>()
            
        };


        foreach (var question in exam.Questions.OrderBy(x => Guid.NewGuid()).Take(10).Where(x=>x.IsLatest && !x.IsDeleted))
        {
            var questionDto = new Test.Question()
            {
                Id = question.Id,
                Text = question.Text,
                HasPicture = question.Image,
                Answers = new List<Test.Answer>()
            };
            result.Questions.Add(questionDto);

            var correctAnswer = question.Answers.First(q => q.IsCorrectAnswer);

            var correctAnswerDto = new Test.Answer()
            {
                Id = correctAnswer.Id,
                Text = correctAnswer.Text,
                IsCorrect = true
            };

            questionDto.Answers.Add(correctAnswerDto);

            questionDto.Answers.AddRange(
                question.Answers.Where(a => !a.IsCorrectAnswer && a.IsLatest && !a.IsDeleted).Select(a =>
                new Test.Answer()
                {
                    Id = a.Id,
                    Text = a.Text,
                    IsCorrect = false
                })
            );
            questionDto.Answers.OrderBy(x => Guid.NewGuid());
        }

        result.Questions.OrderBy(x => Guid.NewGuid());

        var temp = new List<Test>();
        temp.Add(result);
        return temp;
    }

    public void Purchase(PurchaseDto purchaseDto)
    {
        var newPurchase = new CandidateExam()
        {
            ExamID = purchaseDto.examId,
            CandidateId = purchaseDto.candidateId,

            IsSuccess = false,
            ExamPurchaseDate = DateTime.Now,
            MarkedBy = null,
            CreatedDate = DateTime.Now,
            CreatedById = purchaseDto.candidateId,
            UpdatedById = purchaseDto.candidateId,
            UpdatedDate = DateTime.Now,



        };
        if (newPurchase == null)
        {
            throw new Exception("Something went wrong");
        }

        context.CandidateExams.Add(newPurchase);
        context.SaveChanges();

    }




    public List<ExamsPurchasedDto> PurchasedExams(int candidateId)
    {

        var candidate = context.Candidates
            .Include(x => x.CandidateExams.Where(x => !x.IsSuccess && x.MarkDate == null))
                .ThenInclude(x => x.Exam)
            .First(x => x.Id == candidateId);

        var data = candidate.CandidateExams.Select(candidateExam => new ExamsPurchasedDto
        {
            id = candidateExam.Exam.Id,
            title = candidateExam.Exam.Title,
            image = candidateExam.Exam.Image,
            isTestTaken = candidateExam.IsTestTaken != null,
            examdate = candidateExam.ExaminationDate
        }).ToList();

        return data;
    }



    public List<CandidateExamsIdDto> GetCandidateExams(int candidateId)
    {
        var results1 = context.Exams.Where(x => x.IsEnabled && !x.IsDeleted)
            .Include(x => x.CandidateExams)

            .Select(x => new CandidateExamsIdDto()
            {
                ExamId = x.Id,
                Description = x.Description,
                Image = x.Image,
                Price = x.Price,
                Title = x.Title,
                IsPurchased = x.CandidateExams.Any(c => c.CandidateId == candidateId)
            })
            .Where(x => !x.IsPurchased)
            .AsNoTracking()
            .ToList();

        var results2 = context.Exams
            .Include(x => x.CandidateExams)


            .Select(x => new CandidateExamsIdDto()
            {
                ExamId = x.Id,
                Description = x.Description,
                Image = x.Image,
                Price = x.Price,
                Title = x.Title,
                IsPurchased = x.CandidateExams.Any(c => c.CandidateId == candidateId)
            })
            .Where(x => x.IsPurchased)
            .AsNoTracking()
            .ToList();


        var results = results1.Concat(results2).ToList();
        return results;
    }
}

