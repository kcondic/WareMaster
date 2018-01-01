using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using System.Data.Entity.Core.Metadata.Edm;
using System.Data.Entity.Migrations;
using System.Security.Cryptography.X509Certificates;
using WareMaster.Data.Models;
using WareMaster.Data.Models.Entities;

namespace WareMaster.Domain.Repositories
{
    public class OrderRepository
    {
        public OrderRepository()
        {
            _companyRepository = new CompanyRepository();
        }

        private readonly CompanyRepository _companyRepository;

        public List<Order> GetAllOrders(int companyId)
        {
                return _companyRepository.GetCompanyById(companyId).Orders.ToList();
        }

        public List<Order> GetAllCreatedOrders(int companyId)
        {
                return _companyRepository.GetCompanyById(companyId).Orders
                    .Where(order => order.Status == Status.Created).ToList();
        }

        public List<Order> GetAllInProgressOrders(int companyId)
        {
            using (var context = new WarehouseContext())
                return _companyRepository.GetCompanyById(companyId).Orders
                    .Where(order => order.Status == Status.InProgress).ToList();
        }

        public List<Order> GetAllFinishedOrders(int companyId)
        {
                return _companyRepository.GetCompanyById(companyId).Orders
                    .Where(order => order.Status == Status.Finished).ToList();
        }

        public Order GetOrderDetails(int orderId)
        {
            using (var context = new WarehouseContext())
                return context.Orders
                    .Include(order => order.AssignedUser)
                    .Include(order => order.ProductOrders)
                    .Include(order => order.ProductOrders.Select(x => x.Product))
                    .Include(order => order.Company)
                    .Include(order => order.Supplier)
                    .Include(order => order.Supplier.Products)
                    .SingleOrDefault(order => order.Id == orderId);
        }

        public void AddNewOrder(Order order)
        {
            using (var context = new WarehouseContext())
            {
                foreach (var productOrder in order.ProductOrders)
                    context.ProductOrders.Attach(productOrder);

                if(order.AssignedUser != null)
                    context.Users.Attach(order.AssignedUser);

                var newOrder = new Order()
                {
                    Id = order.Id,
                    AssignedUserId = order.AssignedUserId,
                    AssignedManagerId = order.AssignedManagerId,
                    TimeOfCreation = DateTime.Now,
                    Status = order.Status,
                    Type = order.Type,
                    CompanyId = 1,
                    SupplierId = order.SupplierId,
                    ProductOrders = new List<ProductOrders>()
                };

                foreach (var productOrder in order.ProductOrders)
                    newOrder.ProductOrders.Add(new ProductOrders()
                    {
                        OrderId = newOrder.Id,
                        ProductId = productOrder.ProductId,
                        ProductQuantity = productOrder.ProductQuantity
                    });

                context.Orders.Add(newOrder);
                context.SaveChanges();
            }
        }

        public void EditOrder(Order editedOrder)
        {
            using (var context = new WarehouseContext())
            {
                var orderToEdit = context.Orders
                    .Include(order => order.ProductOrders)
                    .Include(order => order.AssignedUser)
                    .SingleOrDefault(order => order.Id == editedOrder.Id);

                if (orderToEdit == null)
                    return;
                if (orderToEdit.AssignedUser != null && editedOrder.AssignedUser != null
                    && orderToEdit.AssignedUser.Id != editedOrder.AssignedUser.Id ||
                    orderToEdit.AssignedUser == null && editedOrder.AssignedUser != null)
                {
                    context.Users.Attach(editedOrder.AssignedUser);
                    orderToEdit.AssignedUser = editedOrder.AssignedUser;
                }
                else if (editedOrder.AssignedUser == null)
                    orderToEdit.AssignedUser = null;

                orderToEdit.ProductOrders = editedOrder.ProductOrders;                

                context.SaveChanges();
            }
        }

        public void DeleteOrder(int orderId)
        {
            using (var context = new WarehouseContext())
            {
                var orderToDelete = context.Orders
                    .Include(order => order.ProductOrders)
                    .FirstOrDefault(order => order.Id == orderId);

                if (orderToDelete == null)
                    return;

                context.Orders.Remove(orderToDelete);
                context.SaveChanges();
            }
        }
    }
}
