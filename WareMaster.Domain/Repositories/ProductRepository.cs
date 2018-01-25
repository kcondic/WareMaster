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
    public class ProductRepository
    {
        public List<Product> GetProducts(int companyId, int currentPosition)
        {
            using (var context = new WareMasterContext())
                return context.Products.Where(product => product.CompanyId == companyId)
                                       .OrderBy(product => product.Id)
                                       .Skip(currentPosition)
                                       .Take(10)
                                       .ToList();
        }

        public List<Product> GetProductsUncontainedInSupplier(int supplierId, int companyId)
        {
            using (var context = new WareMasterContext())
            {
                var supplierToExcludeFrom = context.Suppliers.Include(supplier => supplier.Products).SingleOrDefault(supplier => supplier.Id == supplierId);
                if (supplierToExcludeFrom == null)
                    return null;
                var supplierProductIdsToLeaveOut = supplierToExcludeFrom.Products.Select(product => product.Id);
                return context.Products.Where(product => product.CompanyId == companyId && supplierProductIdsToLeaveOut.All(pr => pr != product.Id))
                                       .ToList();
            }
        }

        public List<Product> GetProductsUncontainedInOrder(int orderId, int companyId)
        {
            using (var context = new WareMasterContext())
            {
                var orderToExcludeFrom = context.Orders.Include(order => order.ProductOrders).SingleOrDefault(order => order.Id == orderId);
                if (orderToExcludeFrom == null)
                    return null;
                var orderProductIdsToLeaveOut = orderToExcludeFrom.ProductOrders.Select(product => product.ProductId);
                return context.Products.Where(product => product.CompanyId == companyId && orderProductIdsToLeaveOut.All(pr => pr != product.Id))
                                       .ToList();
            }
        }

        public Product GetProduct(int productId)
        {
            using (var context = new WareMasterContext())
                return context.Products
                    .Include(product => product.Suppliers)
                    .SingleOrDefault(product => product.Id == productId);
        }

        public Product GetProductDetails(int productId, int companyId)
        {
            using (var context = new WareMasterContext())
            {
                var product = context.Products
                   .Include(p => p.Suppliers)
                   .SingleOrDefault(p => p.Id == productId);
                if (product != null && product.CompanyId == companyId)
                    return product;
                return null;
            }
        }

        public Product GetProductByBarcode(string productBarcode, int companyId)
        {
            using (var context = new WareMasterContext())
                return context.Products.SingleOrDefault(product => product.CompanyId == companyId && product.Barcode == productBarcode);
        }

        public bool DoesBarcodeExist(Product productToTest)
        {
            using (var context = new WareMasterContext())
                return context.Products.Where(p => p.Id != productToTest.Id)
                              .Any(p => p.Barcode == productToTest.Barcode 
                                && p.CompanyId == productToTest.CompanyId);
        }

        public int AddProduct(Product productToAdd)
        {
            using (var context = new WareMasterContext())
            {
                productToAdd.Company = context.Companies.Find(productToAdd.CompanyId);
                context.Companies.Attach(productToAdd.Company);

                context.Products.Add(productToAdd);
                context.SaveChanges();

                return productToAdd.Id;
            }
        }

        public void EditProduct(Product editedProduct)
        {
            using (var context = new WareMasterContext())
            {
                var productToEdit = context.Products
                    .SingleOrDefault(product => product.Id == editedProduct.Id);

                if (productToEdit == null)
                    return;

                productToEdit.Name = editedProduct.Name;
                productToEdit.Counter = editedProduct.Counter;
                productToEdit.Barcode = editedProduct.Barcode;
                productToEdit.ImageUrl = editedProduct.ImageUrl;

                context.SaveChanges();
            }
        }

        public void DeleteProduct(int productId)
        {
            using (var context = new WareMasterContext())
            {
                var productToDelete = context.Products.Include(product => product.ProductOrders)
                                                      .FirstOrDefault(product => product.Id == productId);

                if (productToDelete == null)
                    return;

                context.Products.Remove(productToDelete);
                context.SaveChanges();
            }
        }

        public List<Product> SearchProducts(int companyId, string searchText)
        {
            using (var context = new WareMasterContext())
                return context.Products.Where(product => product.CompanyId == companyId &&
                                              product.Name.ToLower().StartsWith(searchText.ToLower()))
                                       .ToList();
        }

        public int GetProductCount(int companyId)
        {
            using (var context = new WareMasterContext())
                return context.Products.Where(product => product.CompanyId == companyId).Count();
        }
    }
}
