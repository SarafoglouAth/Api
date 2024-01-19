namespace Project.Models;

public record MarkerDelegationDto : MarkerDelegationDtoForMarker
{

    public string Tilte { get; set; } = null!;
    public DateTime? ExamDate { get; set; }
   
}

public record MarkerDelegationDtoForMarker
{
    public int ExamId { get; set; }
    public DateTimeOffset? MarkDueDate { get; set; }
    public int MarkedById { get; set; }
}

