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
        public List<Supplier> GetAllSuppliers(int companyId)
        {
            using (var context = new WareMasterContext())
                return context.Suppliers.Where(supplier => supplier.CompanyId == companyId)
                                        .Include(supplier => supplier.Products)
                                        .ToList();
        }

        public List<Supplier> GetSuppliers(int companyId, int currentPosition)
        {
            using (var context = new WareMasterContext())
            {
                return context.Suppliers.Where(supplier => supplier.CompanyId == companyId)
                                        .OrderBy(supplier => supplier.Id)
                                        .Skip(currentPosition)
                                        .Take(10)
                                        .ToList();
            }
        }

        public Supplier GetSupplierDetails(int supplierId, int companyId)
        {
            using (var context = new WareMasterContext())
            {
                var supplier = context.Suppliers
                   .Include(s => s.Products)
                   .SingleOrDefault(s => s.Id == supplierId);
                if (supplier != null && supplier.CompanyId == companyId)
                    return supplier;
                return null;
            }
        }

        public void AddNewSupplier(Supplier supplier)
        {          
            using (var context = new WareMasterContext())
            {
                supplier.Company = context.Companies.Find(supplier.CompanyId);
                context.Companies.Attach(supplier.Company);
                foreach (var product in supplier.Products)
                    context.Products.Attach(product);

                context.Suppliers.Add(supplier);
                context.SaveChanges();
            }
        }

        public void EditSupplier(Supplier editedSupplier)
        {
            using (var context = new WareMasterContext())
            {
                foreach (var product in editedSupplier.Products)
                    context.Products.Attach(product);

                var supplierToEdit = context.Suppliers
                    .Include(supplier => supplier.Products)
                    .SingleOrDefault(supplier => supplier.Id == editedSupplier.Id);

                if (supplierToEdit == null)
                    return;

                var deletedProducts = supplierToEdit.Products.Except(editedSupplier.Products).ToArray();
                var productOrdersToDelete = new List<ProductOrders>();
                foreach (var product in deletedProducts)
                {
                    productOrdersToDelete.AddRange(context.ProductOrders.Where(productOrder =>
                        productOrder.Order.SupplierId == editedSupplier.Id &&
                        productOrder.ProductId == product.Id &&
                        productOrder.Order.Status == Status.Created));
                }
                context.ProductOrders.RemoveRange(productOrdersToDelete);

                supplierToEdit.Name = editedSupplier.Name;
                supplierToEdit.Email = editedSupplier.Email;
                supplierToEdit.Products = editedSupplier.Products;

                context.SaveChanges();
            }

        }

        public void DeleteSupplier(int supplierId)
        {
            using (var context = new WareMasterContext())
            {
                var supplierToDelete = context.Suppliers.SingleOrDefault(supplier => supplier.Id == supplierId);

                if (supplierToDelete == null)
                    return;

                var supplierToDeleteOrders = context.Orders.Include(order => order.ProductOrders)
                                                           .Where(order => order.SupplierId == supplierToDelete.Id);
                context.Orders.RemoveRange(supplierToDeleteOrders);

                context.Suppliers.Remove(supplierToDelete);
                context.SaveChanges();
            }
        }

        public List<Supplier> SearchSuppliers(int companyId, string searchText)
        {
            using (var context = new WareMasterContext())
                return context.Suppliers.Where(supplier => supplier.CompanyId == companyId &&
                                               supplier.Name.ToLower().StartsWith(searchText.ToLower()))
                                        .ToList();
        }
    }
}
