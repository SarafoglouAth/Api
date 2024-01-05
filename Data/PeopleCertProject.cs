using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Data;

public class PeopleCertProject : DbContext
{
    public PeopleCertProject(DbContextOptions options): base(options) { }

    public virtual DbSet<Answer> Answers { get; set; } = null!;
    public virtual DbSet<Candidate> Candidates { get; set; } = null!;
    public virtual DbSet<CandidateExam> CandidateExams { get; set; } = null!;
    public virtual DbSet<CandidateExamsDetails> CandidateExamsDetails { get; set; } = null!;
    public virtual DbSet<Certificate> Certificate { get; set; } = null!;
    public virtual DbSet<Exam> Exams { get; set; } = null!;
    public virtual DbSet<Question> Questions { get; set; } = null!;
    public virtual DbSet<User> Users { get; set; } = null!;



    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        modelBuilder.Entity<CandidateExamsDetails>(builder =>
        {

            modelBuilder.Entity<Certificate>(builder =>
            {
                builder.HasOne(c => c.CadidateExam)
                       .WithMany(a => a.Certificates)
                       .HasForeignKey(c => c.CadidateExamsID)
                       .OnDelete(DeleteBehavior.NoAction);

                builder.HasOne(c => c.CreatedBy)
                       .WithMany(a => a.CertificateCreatedBy)
                       .HasForeignKey(c => c.CreatedById)
                       .OnDelete(DeleteBehavior.NoAction);

                builder.HasOne(c => c.UpdatedBy)
                       .WithMany(a => a.CertificateUpdatedBy)
                       .HasForeignKey(c => c.UpdatedById)
                       .OnDelete(DeleteBehavior.NoAction);

            });

            builder.HasOne(c => c.Candidate)
                   .WithMany(a => a.CandidateExamsDetails)
                   .HasForeignKey(c => c.CadidateID)
                   .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(c => c.CandidateExam)
                   .WithMany(a => a.CandidateExamsDetails)
                   .HasForeignKey(c => c.CandidateExamID)
                   .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(c => c.Question)
                   .WithMany(a => a.CandidateExamsDetails)
                   .HasForeignKey(c => c.QuestionId)
                   .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(c => c.Answer)
                   .WithMany(a => a.CandidateExamsDetails)
                   .HasForeignKey(c => c.AnswerID)
                   .OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<CandidateExam>(builder =>
    {
        builder.HasOne(c => c.Exam)
               .WithMany(a => a.CandidateExams)
               .HasForeignKey(c => c.ExamID)
               .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(c => c.MarkedBy)
               .WithMany(a => a.CandidateExams)
               .HasForeignKey(c => c.MarkedById)
               .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(c => c.Candidate)
               .WithMany(a => a.CandidateExams)
               .HasForeignKey(c => c.CandidateId)
               .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(c => c.CreatedBy)
               .WithMany(a => a.CandidateExamsCreatedBy)
               .HasForeignKey(c => c.CreatedById)
               .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(c => c.UpdatedBy)
               .WithMany(a => a.CandidateExamsUpdatedBy)
               .HasForeignKey(c => c.UpdatedById)
               .OnDelete(DeleteBehavior.NoAction);

    });


        modelBuilder.Entity<Answer>(builder =>
        {
            builder.HasOne(c => c.Question)
                   .WithMany(a => a.Answers)
                   .HasForeignKey(c => c.QuestionId)
                   .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(c => c.CreatedBy)
                   .WithMany(a => a.AnswersCreatedBy)
                   .HasForeignKey(c => c.CreatedById)
                   .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(c => c.UpdatedBy)
                   .WithMany(a => a.AnswersUpdatedBy)
                   .HasForeignKey(c => c.UpdatedById)
                   .OnDelete(DeleteBehavior.NoAction);

        });


        modelBuilder.Entity<Question>(builder =>
        {
            builder.HasOne(c => c.Exam)
                   .WithMany(a => a.Questions)
                   .HasForeignKey(c => c.ExamID)
                   .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(c => c.CreatedBy)
                   .WithMany(a => a.QuestionCreatedBy)
                   .HasForeignKey(c => c.CreatedById)
                   .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(c => c.UpdatedBy)
                   .WithMany(a => a.QuestionsUpdatedBy)
                   .HasForeignKey(c => c.UpdatedById)
                   .OnDelete(DeleteBehavior.NoAction);

        });

        modelBuilder.Entity<Candidate>(builder =>
        {
            builder.HasOne(c => c.User)
                   .WithOne(a => a.Candidate)
                   .HasForeignKey<Candidate>(c => c.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(c => c.CreatedBy)
                   .WithMany(a => a.CandidatesCreatedBy)
                   .HasForeignKey(c => c.CreatedById)
                   .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(c => c.UpdatedBy)
                   .WithMany(a => a.CandidatesLastUpdatedBy)
                   .HasForeignKey(c => c.UpdatedById)
                   .OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<Exam>(builder =>
        {

            builder.HasOne(c => c.CreatedBy)
                   .WithMany(a => a.ExamsCreatedBy)
                   .HasForeignKey(c => c.CreatedById)
                   .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(c => c.UpdatedBy)
                   .WithMany(a => a.ExamsLastUpdatedBy)
                   .HasForeignKey(c => c.UpdatedById)
                   .OnDelete(DeleteBehavior.NoAction);
        });


    }

}
