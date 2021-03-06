﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using System.Data.Entity.Core.Metadata.Edm;
using System.Data.Entity.Migrations;
using System.Diagnostics;
using System.Security.Cryptography.X509Certificates;
using Newtonsoft.Json.Linq;
using WareMaster.Data.Models;
using WareMaster.Data.Models.Entities;
using Type = WareMaster.Data.Models.Entities.Type;

namespace WareMaster.Domain.Repositories
{
    public class OrderRepository
    {
        public List<Order> GetAllOrders(int companyId)
        {
            using (var context = new WareMasterContext())
                return context.Orders.Include(order => order.AssignedEmployee)
                                     .Include(order => order.Supplier)
                                     .OrderByDescending(order => order.TimeOfCreation)
                                     .Where(order => order.CompanyId == companyId)
                                     .ToList();
        }

        public Order GetOrderDetails(int orderId, int companyId)
        {
            using (var context = new WareMasterContext())
            {
                var order =  context.Orders
                   .Include(o => o.AssignedEmployee)
                   .Include(o => o.ProductOrders)
                   .Include(o => o.ProductOrders.Select(x => x.Product))
                   .Include(o => o.Company)
                   .Include(o => o.Supplier)
                   .Include(o => o.Supplier.Products)
                   .SingleOrDefault(o => o.Id == orderId);
                if (order != null && order.CompanyId == companyId)
                    return order;
                return null;
            }
        }

        public int AddNewOrder(Order order)
        {
            using (var context = new WareMasterContext())
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

                return newOrder.Id;
            }
        }

        public bool EditOrder(Order editedOrder)
        {
            using (var context = new WareMasterContext())
            {
                var orderToEdit = context.Orders
                    .Include(order => order.ProductOrders)
                    .Include(o => o.ProductOrders.Select(x => x.Product))
                    .Include(order => order.AssignedEmployee)
                    .SingleOrDefault(order => order.Id == editedOrder.Id);

                if (orderToEdit == null 
                    || orderToEdit.Status == Status.Finished)
                    return false;

                orderToEdit.Status = editedOrder.Status;

                if (orderToEdit.AssignedEmployee != null && editedOrder.AssignedEmployee != null
                    && orderToEdit.AssignedEmployee.Id != editedOrder.AssignedEmployee.Id ||
                    orderToEdit.AssignedEmployee == null && editedOrder.AssignedEmployee != null)
                {
                    context.Users.Attach(editedOrder.AssignedEmployee);
                    orderToEdit.AssignedEmployee = editedOrder.AssignedEmployee;
                }
                else if (editedOrder.AssignedEmployee == null)
                    orderToEdit.AssignedEmployee = null;

                if (editedOrder.Status == Status.Finished)
                    foreach (var productOrder in orderToEdit.ProductOrders)
                        productOrder.Product.Counter += productOrder.ProductQuantity;

                orderToEdit.Status = editedOrder.Status;
                orderToEdit.ProductOrders = editedOrder.ProductOrders;             
                orderToEdit.Note = editedOrder.Note; 

                context.SaveChanges();

                return true;
            }
        }

        public bool DeleteOrder(int orderId)
        {
            using (var context = new WareMasterContext())
            {
                var orderToDelete = context.Orders
                    .Include(order => order.ProductOrders)
                    .FirstOrDefault(order => order.Id == orderId);

                if (orderToDelete == null 
                    || orderToDelete.Status == Status.InProgress 
                    || orderToDelete.Status == Status.Finished)
                    return false;

                context.Orders.Remove(orderToDelete);
                context.SaveChanges();

                return true;
            }
        }

        public List<Order> GetOrdersAssignedToEmployee(int employeeId)
        {
            using (var context = new WareMasterContext())
            {
                var employeeToGetOrdersFor = context.Users.Find(employeeId);

                if (employeeToGetOrdersFor == null || employeeToGetOrdersFor.Role == Role.Manager)
                    return null;

                return context.Orders.Include(order => order.AssignedEmployee)
                                     .Include(order => order.ProductOrders)
                                     .Include(order => order.ProductOrders.Select(x => x.Product))
                                     .Include(order => order.Supplier)
                                     .Where(order => order.AssignedEmployeeId == employeeId 
                                                     && order.Type == Type.Outgoing 
                                                     && order.Status != Status.Finished).ToList();
            }
        }

        public bool FinishOrder(int orderId, JObject takenProducts)
        {
            using (var context = new WareMasterContext())
            {
                var orderToFinish = context.Orders.Include(order => order.ProductOrders)
                                                  .Include(o => o.ProductOrders.Select(x => x.Product))
                                                  .Include(order => order.AssignedEmployee)
                                                  .SingleOrDefault(order => order.Id == orderId);
                if (orderToFinish == null)
                    return false;

                orderToFinish.Note = "Narudžbu obradio: " + orderToFinish.AssignedEmployee.FirstName + 
                                                         " " + orderToFinish.AssignedEmployee.LastName + "\n";
                var productsToCheck = new List<ProductOrders>(orderToFinish.ProductOrders);
                foreach (var takenProduct in takenProducts)
                {
                    var productOrder = orderToFinish.ProductOrders.SingleOrDefault(pOrder => pOrder.ProductId == int.Parse(takenProduct.Key));
                    productsToCheck.Remove(productOrder);
                    var numberOfTaken = takenProduct.Value.ToObject<int>();
                    if (productOrder == null || numberOfTaken > productOrder.ProductQuantity || numberOfTaken < 0 || numberOfTaken > productOrder.Product.Counter)
                        return false;
                    productOrder.Product.Counter -= numberOfTaken;
                    if (numberOfTaken < productOrder.ProductQuantity)
                        orderToFinish.Note += "Uzeto je " + numberOfTaken + "/" + productOrder.ProductQuantity +
                                              "proizvoda" + productOrder.Product.Name + "\n";
                }
                foreach (var unsentProductOrder in productsToCheck)
                        orderToFinish.Note += "Uzeto je 0" + "/" + unsentProductOrder.ProductQuantity +
                                              " proizvoda" + unsentProductOrder.Product.Name + "\n";

                orderToFinish.Note += "Svi ostali proizvodi su dobro prikupljeni.";
                orderToFinish.Status = Status.Finished;

                context.SaveChanges();
                return true;
            }
        }

        public List<Order> SearchOrders(int companyId, string searchText)
        {
            using (var context = new WareMasterContext())
                return context.Orders.Include(order => order.Supplier)
                                     .Include(order => order.AssignedEmployee)
                                     .Where(order => order.CompanyId == companyId &&
                                            (order.Supplier.Name.ToLower().StartsWith(searchText.ToLower()) || 
                                            order.AssignedEmployee.FirstName.ToLower().StartsWith(searchText.ToLower()) || 
                                            order.AssignedEmployee.LastName.ToLower().StartsWith(searchText.ToLower())))
                                     .ToList();
        }

        public bool ConfirmIncomingOrder(int orderId)
        {
            using (var context = new WareMasterContext())
            {
                var orderToConfirm = context.Orders.Include(order => order.Supplier).SingleOrDefault(order => order.Id == orderId);
                if (orderToConfirm == null || orderToConfirm.Status != Status.Created)
                    return false;
                orderToConfirm.Status = Status.InProgress;
                context.SaveChanges();
                var activityLog = new ActivityLog()
                {
                    CompanyId = orderToConfirm.CompanyId,
                    Text = "Dobavljač " + orderToConfirm.Supplier.Name + " je potvrdio ulaznu narudžbu."
                };
                var activityLogRepository = new ActivityLogRepository();
                activityLogRepository.AddActivityLog(activityLog);

                return true;
            }
        }
    }
}
