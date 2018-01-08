namespace WareMaster.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.ActivityLogs",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Text = c.String(),
                        TimeOfActivity = c.DateTime(nullable: false),
                        UserId = c.Int(),
                        CompanyId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Companies", t => t.CompanyId)
                .ForeignKey("dbo.Users", t => t.UserId)
                .Index(t => t.UserId)
                .Index(t => t.CompanyId);
            
            CreateTable(
                "dbo.Companies",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Users",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        FirstName = c.String(),
                        LastName = c.String(),
                        Role = c.Int(nullable: false),
                        CompanyId = c.Int(nullable: false),
                        ImageUrl = c.String(),
                        Username = c.String(),
                        Password = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Companies", t => t.CompanyId)
                .Index(t => t.CompanyId);
            
            CreateTable(
                "dbo.Orders",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        AssignedEmployeeId = c.Int(),
                        AssignedManagerId = c.Int(),
                        SupplierId = c.Int(),
                        TimeOfCreation = c.DateTime(nullable: false),
                        Status = c.Int(nullable: false),
                        Type = c.Int(nullable: false),
                        CompanyId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.AssignedEmployeeId)
                .ForeignKey("dbo.Users", t => t.AssignedManagerId)
                .ForeignKey("dbo.Companies", t => t.CompanyId)
                .ForeignKey("dbo.Suppliers", t => t.SupplierId)
                .Index(t => t.AssignedEmployeeId)
                .Index(t => t.AssignedManagerId)
                .Index(t => t.SupplierId)
                .Index(t => t.CompanyId);
            
            CreateTable(
                "dbo.ProductOrders",
                c => new
                    {
                        ProductId = c.Int(nullable: false),
                        OrderId = c.Int(nullable: false),
                        ProductQuantity = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.ProductId, t.OrderId })
                .ForeignKey("dbo.Orders", t => t.OrderId)
                .ForeignKey("dbo.Products", t => t.ProductId)
                .Index(t => t.ProductId)
                .Index(t => t.OrderId);
            
            CreateTable(
                "dbo.Products",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        CompanyId = c.Int(nullable: false),
                        Counter = c.Int(nullable: false),
                        ImageUrl = c.String(),
                        Barcode = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Companies", t => t.CompanyId)
                .Index(t => t.CompanyId);
            
            CreateTable(
                "dbo.Suppliers",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        CompanyId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Companies", t => t.CompanyId)
                .Index(t => t.CompanyId);
            
            CreateTable(
                "dbo.SupplierProducts",
                c => new
                    {
                        Supplier_Id = c.Int(nullable: false),
                        Product_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.Supplier_Id, t.Product_Id })
                .ForeignKey("dbo.Suppliers", t => t.Supplier_Id, cascadeDelete: true)
                .ForeignKey("dbo.Products", t => t.Product_Id, cascadeDelete: true)
                .Index(t => t.Supplier_Id)
                .Index(t => t.Product_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ActivityLogs", "UserId", "dbo.Users");
            DropForeignKey("dbo.ActivityLogs", "CompanyId", "dbo.Companies");
            DropForeignKey("dbo.Orders", "SupplierId", "dbo.Suppliers");
            DropForeignKey("dbo.ProductOrders", "ProductId", "dbo.Products");
            DropForeignKey("dbo.SupplierProducts", "Product_Id", "dbo.Products");
            DropForeignKey("dbo.SupplierProducts", "Supplier_Id", "dbo.Suppliers");
            DropForeignKey("dbo.Suppliers", "CompanyId", "dbo.Companies");
            DropForeignKey("dbo.Products", "CompanyId", "dbo.Companies");
            DropForeignKey("dbo.ProductOrders", "OrderId", "dbo.Orders");
            DropForeignKey("dbo.Orders", "CompanyId", "dbo.Companies");
            DropForeignKey("dbo.Orders", "AssignedManagerId", "dbo.Users");
            DropForeignKey("dbo.Orders", "AssignedEmployeeId", "dbo.Users");
            DropForeignKey("dbo.Users", "CompanyId", "dbo.Companies");
            DropIndex("dbo.SupplierProducts", new[] { "Product_Id" });
            DropIndex("dbo.SupplierProducts", new[] { "Supplier_Id" });
            DropIndex("dbo.Suppliers", new[] { "CompanyId" });
            DropIndex("dbo.Products", new[] { "CompanyId" });
            DropIndex("dbo.ProductOrders", new[] { "OrderId" });
            DropIndex("dbo.ProductOrders", new[] { "ProductId" });
            DropIndex("dbo.Orders", new[] { "CompanyId" });
            DropIndex("dbo.Orders", new[] { "SupplierId" });
            DropIndex("dbo.Orders", new[] { "AssignedManagerId" });
            DropIndex("dbo.Orders", new[] { "AssignedEmployeeId" });
            DropIndex("dbo.Users", new[] { "CompanyId" });
            DropIndex("dbo.ActivityLogs", new[] { "CompanyId" });
            DropIndex("dbo.ActivityLogs", new[] { "UserId" });
            DropTable("dbo.SupplierProducts");
            DropTable("dbo.Suppliers");
            DropTable("dbo.Products");
            DropTable("dbo.ProductOrders");
            DropTable("dbo.Orders");
            DropTable("dbo.Users");
            DropTable("dbo.Companies");
            DropTable("dbo.ActivityLogs");
        }
    }
}
