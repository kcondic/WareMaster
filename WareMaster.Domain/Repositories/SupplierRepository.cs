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
    public class SupplierRepository
    {
        public SupplierRepository()
        {
            _company = new CompanyRepository();
        }

        private readonly CompanyRepository _company;

        public List<Supplier> GetAllSuppliersForACompany(int companyId)
        {
            //return _company.GetCompanyById(companyId).Suppliers.ToList();
            using (var context = new WarehouseContext())
            {
                return context.Suppliers.Where(supplier => supplier.CompanyId == companyId).ToList();
            }
        }

        public Supplier GetSupplier(int supplierId)
        {
            using (var context = new WarehouseContext())
                return context.Suppliers
                    .Include(supplier => supplier.Company)
                    .Include(supplier => supplier.Products)
                    .SingleOrDefault(supplier => supplier.Id == supplierId);
        }

        public void AddNewSupplier(Supplier supplier)
        {          
            using (var context = new WarehouseContext())
            {
                context.Companies.Attach(supplier.Company);
                foreach (var product in supplier.Products)
                    context.Products.Attach(product);

                context.Suppliers.Add(supplier);
                context.SaveChanges();
            }
        }

        public void EditSupplier(Supplier editedSupplier)
        {
            using (var context = new WarehouseContext())
            {
                context.Companies.Attach(editedSupplier.Company);
                foreach (var product in editedSupplier.Products)
                    context.Products.Attach(product);

                var supplierToEdit = context.Suppliers
                    .Include(supplier => supplier.Company)
                    .Include(supplier => supplier.Products)
                    .SingleOrDefault(supplier => supplier.Id == editedSupplier.Id);

                if (supplierToEdit == null)
                    return;

                supplierToEdit.Name = editedSupplier.Name;
                supplierToEdit.Products = editedSupplier.Products;
                supplierToEdit.Company = editedSupplier.Company;

                context.SaveChanges();
            }

        }

        public void DeleteSupplier(int supplierId)
        {
            using (var context = new WarehouseContext())
            {
                var supplierToDelete = context.Suppliers.SingleOrDefault(supplier => supplier.Id == supplierId);

                if (supplierToDelete == null)
                    return;

                context.Suppliers.Remove(supplierToDelete);
                context.SaveChanges();
            }
        }
    }
}
