﻿using System;
using System.Collections.Generic;

namespace WareMaster.Data.Models.Entities
{
    public class ProductOrders
    {
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int OrderId{ get; set; }
        public Order Order { get; set; }
        public int ProductQuantity { get; set; }
    }
}
