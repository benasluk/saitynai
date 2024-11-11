using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Plogger.Server.Migrations
{
    /// <inheritdoc />
    public partial class madeusersoptionalforall : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Pipelines_AspNetUsers_UserId",
                table: "Pipelines");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Pipelines",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddForeignKey(
                name: "FK_Pipelines_AspNetUsers_UserId",
                table: "Pipelines",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Pipelines_AspNetUsers_UserId",
                table: "Pipelines");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Pipelines",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Pipelines_AspNetUsers_UserId",
                table: "Pipelines",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
