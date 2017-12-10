﻿using System.Collections.Generic;

namespace WareMaster.Data.Models.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<Order> Orders { get; set; }
        public ICollection<Supplier> Suppliers { get; set; }
        public Company Company { get; set; }
    }
}