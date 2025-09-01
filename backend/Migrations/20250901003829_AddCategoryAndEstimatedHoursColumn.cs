using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskApi.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryAndEstimatedHoursColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Tasks",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "EstimatedHours",
                table: "Tasks",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "EstimatedHours",
                table: "Tasks");
        }
    }
}
