using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookStore.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddCustomerAddressIsDefaultWithUniqueFilter : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CustomerAddresses_UserId",
                table: "CustomerAddresses");

            migrationBuilder.AddColumn<bool>(
                name: "IsDefault",
                table: "CustomerAddresses",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_CustomerAddress_UserId_IsDefault_Unique",
                table: "CustomerAddresses",
                column: "UserId",
                unique: true,
                filter: "[IsDefault] = 1");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CustomerAddress_UserId_IsDefault_Unique",
                table: "CustomerAddresses");

            migrationBuilder.DropColumn(
                name: "IsDefault",
                table: "CustomerAddresses");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerAddresses_UserId",
                table: "CustomerAddresses",
                column: "UserId");
        }
    }
}
