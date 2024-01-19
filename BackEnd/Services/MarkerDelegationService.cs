using Data;
using Data.Models;
using Microsoft.EntityFrameworkCore;
using Project.Contracts;
using Project.Models;

namespace Project.Services;

public class MarkerDelegationService : IMarkerDelegationService
{
    private readonly PeopleCertProjectContext context;

    public MarkerDelegationService(PeopleCertProjectContext context)
    {
        this.context = context;
    }
    public MarkerDelegationAggregate GetAll()
    {

        try
        {
            var markerCandidateExamDtos = context.CandidateExams
                .Include(x => x.Exam)
                .Where(x => x.MarkDate == null && x.ExaminationDate != null)
                .Select(x => new MarkerCandidateExamDto(
                    x.Id,
                    x.ExaminationDate,
                    x.Exam.Title,
                    x.MarkDueDate,
                    x.MarkedById
                ))
                .AsNoTracking()
                .ToList();

            var markersList = context.Users
            .Where(user =>
                user.Role == Role.Marker ||
                user.Role == Role.Admin ||
                markerCandidateExamDtos.Select(x => x.MarkedById).Distinct().Contains(user.Id)
            )
            .Select(user => new MarkersDto()
            {
                UserName = user.Username,
                UserID = user.Id
            }).ToList();

            return new MarkerDelegationAggregate(markerCandidateExamDtos, markersList);

        }
        catch (Exception ex)
        {
            return null!;
        }


    }

    public MarkerDelegationDto? GetOne(int id)
    {
        throw new NotImplementedException();
    }




    public void MarkerAssign(MarkerDelegationDtoForMarker markerDelegationDtoForMarker)
    {
        var specificTest = context.CandidateExams.FirstOrDefault(
            exam => exam.Id == markerDelegationDtoForMarker.ExamId);

        if (specificTest != null)
        {
            // Assign the marker to the test
            specificTest.MarkedById = markerDelegationDtoForMarker.MarkedById;
            if (markerDelegationDtoForMarker.MarkDueDate.HasValue)
            {
                specificTest.MarkDueDate = markerDelegationDtoForMarker.MarkDueDate.Value.LocalDateTime;
            }

            // Save changes to the database
            context.SaveChanges();
        }
        else
        {
            // Handle the case when the test with the given ID and date is not found
            throw new InvalidOperationException("Test not found for the given ID and date.");
        }

    }

    public List<MarkingBoardDto> MarkingBoard(int userid)
    {
        var markerCandidateExamDtos = context.CandidateExams
              .Include(x => x.Exam)
              .Where(x => x.MarkDate == null && x.ExaminationDate != null && x.MarkedById == userid)
              .Select(x => new MarkingBoardDto(
                  x.ExamID,
                  x.Id,
                  x.CandidateId,
                  x.ExaminationDate,
                  x.Exam.Title,
                  x.MarkDueDate)
              )
              .AsNoTracking()
              .ToList();
        return markerCandidateExamDtos;

    }


    public List<MarkersDto> GetAllmarkers()
    {
        var MarkersList = context.Users
            .Where(user => user.Role == Role.Marker || user.Role == Role.Admin)
            .Select(user => new MarkersDto()
            {
                UserName = user.Username,
                UserID = user.Id
            })
            .ToList();
        return MarkersList;
    }
}
public record MarkerDelegationAggregate(List<MarkerCandidateExamDto> MarkerCandidateExams, List<MarkersDto> AvailableMarkers);

public record MarkerCandidateExamDto(int Id, DateTime? ExaminationDate, string Title, DateTime? MarkDueDate, int? MarkedById);

public record MarkingBoardDto(int ExamId,int CandidateExamId, int CandidateId, DateTime? ExaminationDate, string Title, DateTime? MarkDueDate);
