using System;
using System.CodeDom;
using System.Collections.Generic;

namespace WareMaster.Data.Models.Entities
{
    public enum Status
    {
        Created,
        InProgress,
        Finished
    }

    public enum Type
    {
        Incoming,
        Outgoing
    }
    public class Order
    {
        public int Id { get; set; }

        public User AssignedEmployee { get; set; }
        public int? AssignedEmployeeId { get; set; }

        public User AssignedManager { get; set; }
        public int? AssignedManagerId { get; set; }

        public ICollection<ProductOrders> ProductOrders { get; set; }
        public Supplier Supplier { get; set; }
        public int? SupplierId { get; set; }

        public DateTime TimeOfCreation { get; set; }
        public Status Status { get; set; }
        public Type Type { get; set; }
        public Company Company { get; set; }
        public int CompanyId { get; set; }
        public string Note { get; set; }
    }
}
