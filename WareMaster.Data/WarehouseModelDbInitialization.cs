﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WareMaster.Data.Models;
using WareMaster.Data.Models.Entities;

namespace WareMaster.Data
{
    public class WarehouseModelDbInitialization : CreateDatabaseIfNotExists<WarehouseContext>
    {
        protected override void Seed(WarehouseContext context)
        {
            var testUser = new User() {FirstName = "Test", LastName = "Testic", Role = Role.Manager};
            var testCompany = new Company() {Name = "TestKompanija"};
            testCompany.EmployeesManagers.Add(testUser);

            context.Users.Add(testUser);
            context.Companies.Add(testCompany);
            base.Seed(context);
        }
    }
}