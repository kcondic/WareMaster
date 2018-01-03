﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using WareMaster.Data.Models;
using WareMaster.Data.Models.Entities;

namespace WareMaster.Domain.Repositories
{
    public class UserRepository
    {
        public List<User> GetAllUsers(int companyId)
        {
            using (var context = new WarehouseContext())
                return context.Users.Where(user => user.CompanyId == companyId).ToList();
        }

        public List<User> GetAllEmployees(int companyId)
        {
            using (var context = new WarehouseContext())
                return context.Users
                    .Where(user => user.Role == Role.Employee
                            && user.CompanyId == companyId).ToList();
        }


        public List<User> GetAllManagers()
        {
            using (var context = new WarehouseContext())
                return context.Users
                    .Where(user => user.Role == Role.Manager).ToList();
        }

        public User GetUser(int userId)
        {
            using (var context = new WarehouseContext())
                return context.Users
                    .Include(user => user.EmployeeOrders)
                    .Include(user => user.ManagerOrders)
                    .Include(user => user.ActivityLogs)
                    .FirstOrDefault(user => user.Id == userId);
        }

        public User GetManagerByUsername(string username)
        {
            using (var context = new WarehouseContext())
                return context.Users.SingleOrDefault(user => 
                user.Username == username && user.Role == Role.Manager);
        }

        public int GetLastEmployeeId()
        {
            using (var context = new WarehouseContext())
                return context.Users.Where(user => user.Role == Role.Employee)
                                    .OrderByDescending(user => user.Id).First().Id;
        }

        public void AddUser(User userToAdd)
        {
            using (var context = new WarehouseContext())
            {
                userToAdd.Company = context.Companies.Find(userToAdd.CompanyId);
                context.Companies.Attach(userToAdd.Company);

                context.Users.Add(userToAdd);
                context.SaveChanges();
            }
        }

        public void EditUser(User editedUser)
        {
            using (var context = new WarehouseContext())
            {
                var userToEdit = context.Users
                    .SingleOrDefault(user => user.Id == editedUser.Id);

                if (userToEdit == null)
                    return;

                userToEdit.FirstName = editedUser.FirstName;
                userToEdit.LastName = editedUser.LastName;
                userToEdit.ImageUrl = editedUser.ImageUrl;
                userToEdit.Role = editedUser.Role;

                context.SaveChanges();
            }
        }

        public void DeleteUser(int userId)
        {
            using (var context = new WarehouseContext())
            {
                var userToDelete = context.Users.FirstOrDefault(user => user.Id == userId);

                if (userToDelete == null)
                    return;

                context.Users.Remove(userToDelete);
                context.SaveChanges();
            }
        }

        public bool DoesUsernameExist(string username)
        {
            using (var context = new WarehouseContext())
                return context.Users.Any(user => user.Username == username);
        }
    }
}
