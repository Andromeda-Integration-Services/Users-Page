using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CAFMSystem.API.Migrations
{
    /// <inheritdoc />
    public partial class AddTicketTypeField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Tickets",
                type: "int",
                nullable: false,
                defaultValue: 2);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "Tickets");
        }
    }
}
