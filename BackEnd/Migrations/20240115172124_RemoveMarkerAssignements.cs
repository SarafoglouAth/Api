using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Project.Migrations
{
    /// <inheritdoc />
    public partial class RemoveMarkerAssignements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MarkerAssignments");

            migrationBuilder.AlterColumn<float>(
                name: "MaximumScore",
                table: "CandidateExams",
                type: "real",
                nullable: true,
                oldClrType: typeof(float),
                oldType: "real");

            migrationBuilder.AlterColumn<int>(
                name: "MarkedById",
                table: "CandidateExams",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<float>(
                name: "MaximumScore",
                table: "CandidateExams",
                type: "real",
                nullable: false,
                defaultValue: 0f,
                oldClrType: typeof(float),
                oldType: "real",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "MarkedById",
                table: "CandidateExams",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "MarkerAssignments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CandidateExamId = table.Column<int>(type: "int", nullable: false),
                    CreatedById = table.Column<int>(type: "int", nullable: false),
                    MarkerId = table.Column<int>(type: "int", nullable: false),
                    UpdatedById = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MarkerAssignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MarkerAssignments_CandidateExams_CandidateExamId",
                        column: x => x.CandidateExamId,
                        principalTable: "CandidateExams",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MarkerAssignments_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MarkerAssignments_Users_MarkerId",
                        column: x => x.MarkerId,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MarkerAssignments_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_MarkerAssignments_CandidateExamId",
                table: "MarkerAssignments",
                column: "CandidateExamId");

            migrationBuilder.CreateIndex(
                name: "IX_MarkerAssignments_CreatedById",
                table: "MarkerAssignments",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_MarkerAssignments_MarkerId",
                table: "MarkerAssignments",
                column: "MarkerId");

            migrationBuilder.CreateIndex(
                name: "IX_MarkerAssignments_UpdatedById",
                table: "MarkerAssignments",
                column: "UpdatedById");
        }
    }
}
