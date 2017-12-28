using System;
using System.Collections.Generic;

namespace WareMaster.Data.Models.Entities
{
    public enum Status
    {
        Created,
        InProgress,
        Finished
    }
    public class Order
    {
        public int Id { get; set; }

        public User AssignedUser { get; set; }
        public int? AssignedUserId { get; set; }

        public User AssignedManager { get; set; }
        public int? AssignedManagerId { get; set; }

        public ICollection<ProductOrders> ProductOrders { get; set; }
        public Supplier Supplier { get; set; }
        public int? SupplierId { get; set; }

        public DateTime TimeOfCreation { get; set; }
        public Status Status { get; set; }
        public Company Company { get; set; }
        public int CompanyId { get; set; }
    }
}
