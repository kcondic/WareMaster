using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using WareMaster.Data.Models.Entities;

namespace WareMaster.Data.Models
{
    public class WarehouseContext : DbContext
    {
        public WarehouseContext() : base("WareMasterDatabase")
        {
            Database.SetInitializer(new WarehouseModelDbInitialization());  
        }

        public virtual DbSet<Company> Companies { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Product> Products { get; set; }
        public virtual DbSet<Order> Orders { get; set; }
        public virtual DbSet<Supplier> Suppliers { get; set; }
        public virtual DbSet<ActivityLog> ActivityLogs { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
            modelBuilder.Entity<User>()
                .HasRequired(x => x.Company)
                .WithMany(x => x.EmployeesManagers)
                .HasForeignKey(x => x.CompanyId);
            modelBuilder.Entity<Product>()
                .HasRequired(x => x.Company)
                .WithMany(x => x.Products)
                .HasForeignKey(x => x.CompanyId);
            modelBuilder.Entity<Order>()
                .HasRequired(x => x.Company)
                .WithMany(x => x.Orders)
                .HasForeignKey(x => x.CompanyId);
            modelBuilder.Entity<Supplier>()
                .HasRequired(x => x.Company)
                .WithMany(x => x.Suppliers)
                .HasForeignKey(x => x.CompanyId);
            modelBuilder.Entity<ActivityLog>()
                .HasRequired(x => x.User)
                .WithMany(x => x.ActivityLogs)
                .HasForeignKey(x => x.UserId);
            base.OnModelCreating(modelBuilder);
        }
    }
}
