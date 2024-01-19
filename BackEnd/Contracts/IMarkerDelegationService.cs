using Project.Models;
using Project.Services;

namespace Project.Contracts;

public interface IMarkerDelegationService
{
    MarkerDelegationAggregate GetAll();
    MarkerDelegationDto? GetOne(int id);
    void MarkerAssign(MarkerDelegationDtoForMarker markerDelegationDtoForMarker);
    List<MarkingBoardDto> MarkingBoard(int userid);
}