namespace Project.Models;

public record Test
{
    public int ExamId { get; set; }
    public int? CandidateExamId { get; set; }
    public string Title { get; set; } = null!;
    public float Price { get; set; }
    public string? Image { get; set; }
    public string? Description { get; set; }
    public DateTime ExamDate { get; set; }
    public List<Question> Questions { get; set; }

    public record Question
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public string? HasPicture { get; set; }
        public List<Answer> Answers { get; set; }
        public int? UserAnswer { get; set; }
    }

    public record Answer
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public bool IsCorrect { get; set; }
    }
}
