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
        public List<Order> GetAllOrders(int companyId)
        {
            using (var context = new WarehouseContext())
                return context.Orders.Where(order => order.CompanyId == companyId).ToList();
        }

        public List<Order> GetAllCreatedOrders(int companyId)
        {
            using (var context = new WarehouseContext())
                return context.Orders.Where(order => order.CompanyId == companyId && 
                                            order.Status == Status.Created).ToList();
        }

        public List<Order> GetAllInProgressOrders(int companyId)
        {
            using (var context = new WarehouseContext())
                return context.Orders.Where(order => order.CompanyId == companyId &&
                                            order.Status == Status.InProgress).ToList();
        }

        public List<Order> GetAllFinishedOrders(int companyId)
        {
            using (var context = new WarehouseContext())
                return context.Orders.Where(order => order.CompanyId == companyId &&
                                            order.Status == Status.Finished).ToList();
        }

        public Order GetOrderDetails(int orderId)
        {
            using (var context = new WarehouseContext())
                return context.Orders
                    .Include(order => order.AssignedEmployee)
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

                var newOrder = new Order()
                {
                    AssignedEmployeeId = order.AssignedEmployeeId,
                    AssignedManagerId = order.AssignedManagerId,
                    TimeOfCreation = DateTime.Now,
                    Status = order.Status,
                    Type = order.Type,
                    CompanyId = order.CompanyId,
                    SupplierId = order.SupplierId,
                    ProductOrders = order.ProductOrders
                };

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
                    .Include(order => order.AssignedEmployee)
                    .SingleOrDefault(order => order.Id == editedOrder.Id);

                if (orderToEdit == null)
                    return;
                if (orderToEdit.AssignedEmployee != null && editedOrder.AssignedEmployee != null
                    && orderToEdit.AssignedEmployee.Id != editedOrder.AssignedEmployee.Id ||
                    orderToEdit.AssignedEmployee == null && editedOrder.AssignedEmployee != null)
                {
                    context.Users.Attach(editedOrder.AssignedEmployee);
                    orderToEdit.AssignedEmployee = editedOrder.AssignedEmployee;
                }
                else if (editedOrder.AssignedEmployee == null)
                    orderToEdit.AssignedEmployee = null;

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
