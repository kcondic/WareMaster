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

        public int AddNewCompany(string companyToAddName)
        {
            using (var context = new WarehouseContext())
            {
                var companyToAdd = new Company
                {
                    Name = companyToAddName
                };

                context.Companies.Add(companyToAdd);
                context.SaveChanges();

                return companyToAdd.Id;
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
