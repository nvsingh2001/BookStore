using BookStore.DomainModel.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookStore.DataAccess;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Admin> Admins { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<WishlistItem> WishlistItems { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Feedback> Feedbacks { get; set; }
    public DbSet<CustomerAddress> CustomerAddresses { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(e => e.Fullname).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.HasIndex(e => e.Email).IsUnique().HasDatabaseName("IX_User_Email_Unique");
            entity.Property(e => e.Password).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Phone).IsRequired().HasMaxLength(10);
            entity.HasIndex(e => e.Phone).IsUnique().HasDatabaseName("IX_User_Phone_Unique");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(e => e.IsVerified).IsRequired().HasDefaultValue(false);

            entity.HasMany(u => u.CustomerAddresses)
                .WithOne(c => c.User)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(u => u.CartItems)
                .WithOne(ci => ci.User)
                .HasForeignKey(ci => ci.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(u => u.WishlistItems)
                .WithOne(wi => wi.User)
                .HasForeignKey(wi => wi.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(u => u.Feedbacks)
                .WithOne(f => f.User)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(u => u.Orders)
                .WithOne(o => o.User)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<CustomerAddress>(entity =>
        {
            entity.Property(e => e.Fulladdress).IsRequired().HasMaxLength(255);
            entity.Property(e => e.City).IsRequired().HasMaxLength(255);
            entity.Property(e => e.State).IsRequired().HasMaxLength(255);

            entity.HasMany(ca => ca.Orders)
                .WithOne(o => o.Address)
                .HasForeignKey(o => o.AddressId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Admin>(entity =>
        {
            entity.Property(e => e.Fullname).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.HasIndex(e => e.Email).IsUnique().HasDatabaseName("IX_Admin_Email_Unique");
            entity.Property(e => e.Password).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Phone).IsRequired().HasMaxLength(10);
            entity.HasIndex(e => e.Phone).IsUnique().HasDatabaseName("IX_Admin_Phone_Unique");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

            entity.HasMany(a => a.Products)
                .WithOne(p => p.Admin)
                .HasForeignKey(p => p.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.Property(e => e.BookName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Author).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).IsRequired().HasMaxLength(512);
            entity.Property(e => e.Quantity).IsRequired();
            entity.Property(e => e.Price).IsRequired().HasColumnType("decimal(10, 2)");
            entity.Property(e => e.DiscountPrice).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.AddedOn).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(e => e.LastModifiedDate).HasDefaultValueSql("GETUTCDATE()");


            entity.HasMany(p => p.Feedbacks)
                .WithOne(f => f.Product)
                .HasForeignKey(f => f.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(p => p.OrderItems)
                .WithOne(i => i.Product)
                .HasForeignKey(i => i.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(p => p.WishlistItems)
                .WithOne(wi => wi.Product)
                .HasForeignKey(wi => wi.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(p => p.CartItems)
                .WithOne(ci => ci.Product)
                .HasForeignKey(ci => ci.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.Property(e => e.OrderDate).HasDefaultValueSql("GETUTCDATE()");

            entity.HasMany(o => o.OrderItems)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.Property(e => e.ProductName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.ProductQuantity).IsRequired();
            entity.Property(e => e.ProductPrice).HasColumnType("decimal(10, 2)");
        });

        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.Property(e => e.QuantityToBuy).IsRequired().HasDefaultValue(1);
            entity.Property(e => e.AddedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.HasIndex(ci => new { ci.UserId, ci.ProductId }).IsUnique()
                .HasDatabaseName("IX_CartItem_UserId_ProductId_Unique");
        });

        modelBuilder.Entity<WishlistItem>(entity =>
        {
            entity.Property(e => e.AddedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.HasIndex(wi => new { wi.UserId, wi.ProductId }).IsUnique()
                .HasDatabaseName("IX_WishlistItem_UserId_ProductId_Unique");
        });

        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.Property(e => e.Comment).IsRequired().HasMaxLength(512);
            entity.Property(e => e.Rating).IsRequired();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.HasIndex(f => new { f.UserId, f.ProductId }).IsUnique()
                .HasDatabaseName("IX_Feedback_UserId_ProductId_Unique");
        });
    }
}