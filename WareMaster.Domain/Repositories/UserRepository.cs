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
        public UserRepository()
        {
            _companyRepository = new CompanyRepository();
        }

        private readonly CompanyRepository _companyRepository;

        public List<User> GetAllUsers()
        {
            using(var context = new WarehouseContext())
                return context.Users.ToList();
        }

        public List<User> GetAllUsersFromACompany(int companyId)
        {
                return _companyRepository.GetCompanyById(companyId).EmployeesManagers.ToList();
        }

        public List<User> GetAllEmployees()
        {
            using (var context = new WarehouseContext())
                return context.Users
                    //.Include(user => user.Orders)
                    //.Include(user => user.ActivityLogs)
                    .Where(user => user.Role == Role.Employee).ToList();
        }

        public List<User> GetAllEmployeesFromACompany(int companyId)
        {
            //return _context.Users
              //  .Where(user => user.Company.Id == companyId && user.Role == Role.Employee).ToList();
            return _companyRepository.GetCompanyById(companyId).EmployeesManagers.Where(user => user.Role == Role.Employee).ToList();
        }

        public List<User> GetAllManagers()
        {
            using (var context = new WarehouseContext())
                return context.Users
                    //.Include(user => user.Orders)
                    //.Include(user => user.ActivityLogs)
                    .Where(user => user.Role == Role.Manager).ToList();
        }

        public List<User> GetAllManagersFromACompany(int companyId)
        {
                return _companyRepository.GetCompanyById(companyId).EmployeesManagers.Where(user => user.Role == Role.Manager).ToList();
        }

        public User GetUser(int userId)
        {
            using (var context = new WarehouseContext())
                return context.Users
                    .Include(user => user.Orders)
                    .Include(user => user.ActivityLogs)
                    .FirstOrDefault(user => user.Id == userId);
        }

        public void AddUser(User userToAdd)
        {
            using (var context = new WarehouseContext())
            {
                context.Companies.Attach(userToAdd.Company);
                foreach (var order in userToAdd.Orders)
                    context.Orders.Attach(order);

                context.Users.Add(userToAdd);
                context.SaveChanges();
            }

        }

        public void EditUser(User editedUser)
        {
            using (var context = new WarehouseContext())
            {
                context.Companies.Attach(editedUser.Company);
                foreach (var order in editedUser.Orders)
                    context.Orders.Attach(order);

                var userToEdit = context.Users
                    .Include(user => user.Orders)
                    .Include(user => user.ActivityLogs)
                    .Include(user => user.Company)
                    .SingleOrDefault(user => user.Id == editedUser.Id);

                if (userToEdit == null)
                    return;

                userToEdit.FirstName = editedUser.FirstName;
                userToEdit.LastName = editedUser.LastName;
                userToEdit.Role = editedUser.Role;
                userToEdit.Orders = editedUser.Orders;
                userToEdit.Company = editedUser.Company;
                userToEdit.ActivityLogs = editedUser.ActivityLogs;

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
    }
}
