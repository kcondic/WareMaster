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
    }
}
