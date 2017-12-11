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
        public ProductRepository()
        {
            _companyRepository = new CompanyRepository();
        }

        private readonly CompanyRepository _companyRepository;

        public List<Product> GetAllProductsFromACompany(int companyId)
        {
                return _companyRepository.GetCompanyById(companyId).Products.ToList();
        }

        /*public List<Product> GetAllProductsByCategory()
        {

        }*/

        public Product GetProduct(int productId)
        {
            using (var context = new WarehouseContext())
                return context.Products
                    .Include(product => product.Orders)
                    .Include(product => product.Suppliers)
                    .Include(product => product.Company)
                    .SingleOrDefault(product => product.Id == productId);
        }

        public void CreateNewProduct(Product product)
        {
            using (var context = new WarehouseContext())
            {
                context.Companies.Attach(product.Company);
                foreach (var order in product.Orders)
                    context.Orders.Attach(order);
                foreach (var supplier in product.Suppliers)
                    context.Suppliers.Attach(supplier);

                context.Products.Add(product);
                context.SaveChanges();
            }
        }

        public void EditProduct(Product editedProduct)
        {
            using (var context = new WarehouseContext())
            {
                context.Companies.Attach(editedProduct.Company);
                foreach (var order in editedProduct.Orders)
                    context.Orders.Attach(order);
                foreach (var supplier in editedProduct.Suppliers)
                    context.Suppliers.Attach(supplier);

                var productToEdit = context.Products
                    .Include(product => product.Orders)
                    .Include(product => product.Suppliers)
                    .Include(product => product.Company)
                    .SingleOrDefault(product => product.Id == editedProduct.Id);

                if (productToEdit == null)
                    return;

                productToEdit.Name = editedProduct.Name;
                productToEdit.Orders = editedProduct.Orders;
                productToEdit.Suppliers = editedProduct.Suppliers;
                productToEdit.Company = editedProduct.Company;

                context.SaveChanges();
            }
        }

        public void DeleteProduct(int productId)
        {
            using (var context = new WarehouseContext())
            {
                var productToDelete = context.Products.FirstOrDefault(product => product.Id == productId);

                if (productToDelete == null)
                    return;

                context.Products.Remove(productToDelete);
                context.SaveChanges();
            }
        }
    }
}
