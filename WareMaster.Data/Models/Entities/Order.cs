﻿using System;
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
        public ICollection<User> AssignedUsers { get; set; }
        public ICollection<Product> Products { get; set; }
        public DateTime TimeOfCreation { get; set; }
        public Status Status { get; set; }
        public Company Company { get; set; }
    }
}