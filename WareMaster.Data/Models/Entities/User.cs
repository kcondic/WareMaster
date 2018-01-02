using System.Collections.Generic;

namespace WareMaster.Data.Models.Entities
{
    public enum Role
    {
        Employee,
        Manager
    }
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public Role Role { get; set; }
        public ICollection<Order> EmployeeOrders { get; set; }
        public ICollection<Order> ManagerOrders { get; set; }
        public Company Company { get; set; }
        public int CompanyId { get; set; }
        public ICollection<ActivityLog> ActivityLogs { get; set; }
        public string ImageUrl { get; set; }
    }
}
