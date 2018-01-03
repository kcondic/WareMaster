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

        public List<Supplier> GetAllSuppliers(int companyId)
        {
            using (var context = new WarehouseContext())
            {
                return context.Suppliers
                    .Include(supplier => supplier.Products)
                    .Where(supplier => supplier.CompanyId == companyId).ToList();
            }
        }

        public Supplier GetSupplier(int supplierId)
        {
            using (var context = new WarehouseContext())
                return context.Suppliers
                    .Include(supplier => supplier.Products)
                    .SingleOrDefault(supplier => supplier.Id == supplierId);
        }

        public void AddNewSupplier(Supplier supplier)
        {          
            using (var context = new WarehouseContext())
            {
                supplier.Company = context.Companies.FirstOrDefault(x => x.Id == 1);
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
                foreach (var product in editedSupplier.Products)
                    context.Products.Attach(product);

                var supplierToEdit = context.Suppliers
                    .Include(supplier => supplier.Products)
                    .SingleOrDefault(supplier => supplier.Id == editedSupplier.Id);

                if (supplierToEdit == null)
                    return;

                supplierToEdit.Name = editedSupplier.Name;
                supplierToEdit.Products = editedSupplier.Products;

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
