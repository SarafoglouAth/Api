using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Project.Migrations
{
    /// <inheritdoc />
    public partial class ExamFixes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Exams",
                newName: "Title");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Exams",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Exams");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Exams",
                newName: "Name");
        }
    }
}
