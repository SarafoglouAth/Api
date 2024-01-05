namespace Project.Contracts
{
    public interface IMarkerService
    {
        List<CandidateExamsDetailsDto> GetAll(int markedBy = 0);
        CandidateExamsDetailsDto GetOne(int id);
        void MarkerAssign(int id);
        void Mark(int candidateExamId, int obtainedScore);
    }
    public record CandidateExamsDetailsDto
    {
        //placeholder
    }
}
