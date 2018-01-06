namespace WareMaster.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class initialcreate : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Products", "Barcode", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Products", "Barcode");
        }
    }
}
