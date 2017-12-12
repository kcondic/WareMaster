using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using WareMaster.Data.Models;
using WareMaster.Data.Models.Entities;

namespace WareMaster.Domain.Repositories
{
    public class CompanyRepository
    {
        public Company GetCompanyById(int companyId)
        {
            using (var context = new WarehouseContext())
                return context.Companies
                    .Include(company => company.EmployeesManagers)
                    .Include(company => company.Products)
                    .Include(company => company.Orders)
                    .Include(company => company.Suppliers)
                    .FirstOrDefault(company => company.Id == companyId);
        }

        public void AddNewCompany(Company companyToAdd)
        {
            using (var context = new WarehouseContext())
            {
                foreach (var user in companyToAdd.EmployeesManagers)
                    context.Users.Attach(user);
                foreach (var product in companyToAdd.Products)
                    context.Products.Attach(product);
                foreach (var order in companyToAdd.Orders)
                    context.Orders.Attach(order);
                foreach (var supplier in companyToAdd.Suppliers)
                    context.Suppliers.Attach(supplier);

                context.Companies.Add(companyToAdd);
                context.SaveChanges();
            }
        }

        public void DeleteCompany(int companyId)
        {
            using (var context = new WarehouseContext())
            {
                var companyToDelete = context.Companies.FirstOrDefault(company => company.Id == companyId);

                if (companyToDelete == null)
                    return;

                context.Companies.Remove(companyToDelete);
                context.SaveChanges();
            }
        }
    }
}
