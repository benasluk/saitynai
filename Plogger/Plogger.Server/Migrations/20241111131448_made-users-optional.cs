using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Plogger.Server.Migrations
{
    /// <inheritdoc />
    public partial class madeusersoptional : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Entries_AspNetUsers_UserId",
                table: "Entries");

            migrationBuilder.DropForeignKey(
                name: "FK_Logs_AspNetUsers_UserId",
                table: "Logs");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Logs",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Entries",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddForeignKey(
                name: "FK_Entries_AspNetUsers_UserId",
                table: "Entries",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Logs_AspNetUsers_UserId",
                table: "Logs",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Entries_AspNetUsers_UserId",
                table: "Entries");

            migrationBuilder.DropForeignKey(
                name: "FK_Logs_AspNetUsers_UserId",
                table: "Logs");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Logs",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Entries",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Entries_AspNetUsers_UserId",
                table: "Entries",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Logs_AspNetUsers_UserId",
                table: "Logs",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
