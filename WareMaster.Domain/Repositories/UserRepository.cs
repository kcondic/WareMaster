using System;
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
            using (var context = new WareMasterContext())
                return context.Users.Where(user => user.CompanyId == companyId).ToList();
        }

        public List<User> GetAllEmployees(int companyId)
        {
            using (var context = new WareMasterContext())
                return context.Users
                    .Where(user => user.Role == Role.Employee
                            && user.CompanyId == companyId).ToList();
        }


        public List<User> GetAllManagers(int companyId)
        {
            using (var context = new WareMasterContext())
                return context.Users
                    .Where(user => user.Role == Role.Manager
                            && user.CompanyId == companyId).ToList();
        }

        public User GetUser(int userId)
        {
            using (var context = new WareMasterContext())
                return context.Users
                    .Include(user => user.EmployeeOrders)
                    .Include(user => user.ManagerOrders)
                    .Include(user => user.ActivityLogs)
                    .FirstOrDefault(user => user.Id == userId);
        }

        public User GetByUsername(string username)
        {
            using (var context = new WareMasterContext())
                return context.Users.SingleOrDefault(user => 
                user.Username == username);
        }

        public int GetLastEmployeeId()
        {
            using (var context = new WareMasterContext())
                return context.Users.Where(user => user.Role == Role.Employee)
                                    .OrderByDescending(user => user.Id).First().Id;
        }

        public void AddUser(User userToAdd)
        {
            using (var context = new WareMasterContext())
            {
                userToAdd.Company = context.Companies.Find(userToAdd.CompanyId);
                context.Companies.Attach(userToAdd.Company);

                context.Users.Add(userToAdd);
                context.SaveChanges();
            }
        }

        public void EditUser(User editedUser)
        {
            using (var context = new WareMasterContext())
            {
                var userToEdit = context.Users
                    .SingleOrDefault(user => user.Id == editedUser.Id);

                if (userToEdit == null)
                    return;

                userToEdit.FirstName = editedUser.FirstName;
                userToEdit.LastName = editedUser.LastName;
                userToEdit.Password = editedUser.Password;
                userToEdit.ImageUrl = editedUser.ImageUrl;
                userToEdit.Role = editedUser.Role;

                context.SaveChanges();
            }
        }

        public void DeleteUser(int userId)
        {
            using (var context = new WareMasterContext())
            {
                var userToDelete = context.Users.FirstOrDefault(user => user.Id == userId);

                if (userToDelete == null)
                    return;

                var userToDeleteEmployeeOrders = context.Orders.Where(order => order.AssignedEmployeeId == userToDelete.Id);
                foreach (var order in userToDeleteEmployeeOrders)
                    order.AssignedEmployeeId = null;

                var userToDeleteManagerOrders = context.Orders.Where(order => order.AssignedManagerId == userToDelete.Id);
                foreach (var order in userToDeleteManagerOrders)
                    order.AssignedManagerId = null;

                var userToDeleteLogs = context.ActivityLogs.Where(log => log.UserId == userToDelete.Id);
                foreach (var log in userToDeleteLogs)
                    log.UserId = null;

                context.Users.Remove(userToDelete);
                context.SaveChanges();
            }
        }

        public bool DoesUsernameExist(string username)
        {
            using (var context = new WareMasterContext())
                return context.Users.Any(user => user.Username == username);
        }
    }
}
