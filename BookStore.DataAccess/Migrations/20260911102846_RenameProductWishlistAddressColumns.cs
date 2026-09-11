using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookStore.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class RenameProductWishlistAddressColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "WishlistId",
                table: "WishlistItems",
                newName: "WishlistItemId");

            migrationBuilder.RenameColumn(
                name: "BookId",
                table: "Products",
                newName: "ProductId");

            migrationBuilder.RenameColumn(
                name: "Fulladdress",
                table: "CustomerAddresses",
                newName: "FullAddress");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "WishlistItemId",
                table: "WishlistItems",
                newName: "WishlistId");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                table: "Products",
                newName: "BookId");

            migrationBuilder.RenameColumn(
                name: "FullAddress",
                table: "CustomerAddresses",
                newName: "Fulladdress");
        }
    }
}
