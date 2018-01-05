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
        public List<Product> GetAllProducts(int companyId)
        {
            using (var context = new WarehouseContext())
                return context.Products.Where(product => product.CompanyId == companyId).ToList();
        }

        public Product GetProduct(int productId)
        {
            using (var context = new WarehouseContext())
                return context.Products
                    .Include(product => product.Suppliers)
                    .SingleOrDefault(product => product.Id == productId);
        }

        public int GetLastProductId()
        {
            using (var context = new WarehouseContext())
                return context.Products.OrderByDescending(user => user.Id).First().Id;
        }

        public void AddProduct(Product productToAdd)
        {
            using (var context = new WarehouseContext())
            {
                productToAdd.Company = context.Companies.Find(productToAdd.CompanyId);
                context.Companies.Attach(productToAdd.Company);

                context.Products.Add(productToAdd);
                context.SaveChanges();
            }
        }

        public void EditProduct(Product editedProduct)
        {
            using (var context = new WarehouseContext())
            {
                var productToEdit = context.Products
                    .SingleOrDefault(product => product.Id == editedProduct.Id);

                if (productToEdit == null)
                    return;

                productToEdit.Name = editedProduct.Name;
                productToEdit.Counter = editedProduct.Counter;
                productToEdit.ImageUrl = editedProduct.ImageUrl;

                context.SaveChanges();
            }
        }

        public void DeleteProduct(int productId)
        {
            using (var context = new WarehouseContext())
            {
                var productToDelete = context.Products.Include(product => product.ProductOrders)
                                                      .FirstOrDefault(product => product.Id == productId);

                if (productToDelete == null)
                    return;

                context.Products.Remove(productToDelete);
                context.SaveChanges();
            }
        }
    }
}
