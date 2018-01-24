using System.Collections.Generic;

namespace WareMaster.Data.Models.Entities
{
    public class Supplier
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<Product> Products { get; set; }
        public Company Company { get; set; }
        public int CompanyId { get; set; }
        public string Email { get; set; }
    }
}
