using System.Collections.Generic;

namespace WareMaster.Data.Models.Entities
{
    public class Company
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<User> EmployeesManagers { get; set; }
        public ICollection<Product> Products { get; set; }
        public ICollection<Order> Orders { get; set; }
        public ICollection<Supplier> Suppliers { get; set; }
    }
}
