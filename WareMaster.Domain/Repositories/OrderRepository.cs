using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
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
                    .Include(order => order.AssignedUsers)
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
                foreach (var user in order.AssignedUsers)
                    context.Users.Attach(user);

                var newOrder = new Order()
                {
                    Id = order.Id,
                    AssignedUsers = order.AssignedUsers,
                    TimeOfCreation = DateTime.Now,
                    Status = order.Status,
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
                    .Include(order => order.AssignedUsers)
                    .Include(order => order.ProductOrders)
                    .SingleOrDefault(order => order.Id == editedOrder.Id);

                if (orderToEdit == null)
                    return;

                foreach (var user in editedOrder.AssignedUsers)
                {
                    //if(context.Users.Local.All(e => e.Id != user.Id))
                    try
                    {
                        context.Users.Attach(user);
                    }
                    catch { }
                }
                /*foreach (var productOrder in editedOrder.ProductOrders)
                {
                    try
                    {
                        context.Products.Attach(productOrder.Product);                     
                    }
                    catch { }
                    try
                    {
                        context.ProductOrders.Attach(productOrder);
                    }
                    catch { }
                }*/
                orderToEdit.ProductOrders = editedOrder.ProductOrders;
                //orderToEdit.AssignedUsers = editedOrder.AssignedUsers;
                /*foreach (var user in orderToEdit.AssignedUsers)
                {
                    user.Orders.Add(orderToEdit);
                }*/
                context.SaveChanges();
            }
        }

        public void DeleteOrder(int orderId)
        {
            using (var context = new WarehouseContext())
            {
                var orderToDelete = context.Orders.FirstOrDefault(order => order.Id == orderId);

                if (orderToDelete == null)
                    return;

                context.Orders.Remove(orderToDelete);
                context.SaveChanges();
            }
        }
    }
}
