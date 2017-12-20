using System.Web.Http;
using WareMaster.Data.Models.Entities;
using WareMaster.Domain.Repositories;

namespace WareMaster.Controllers
{
    [RoutePrefix("api/employees")]
    public class EmployeesController : ApiController
    {
        public EmployeesController()
        {
            _employeeRepository = new UserRepository();
        }
        private readonly UserRepository _employeeRepository;

        [HttpGet]
        [Route("")]
        public IHttpActionResult GetAllEmployees()
        {
            return Ok(_employeeRepository.GetAllEmployees());
        }

        [HttpPost]
        [Route("add")]
        public IHttpActionResult AddEmployee(User employeeToAdd)
        {
            _employeeRepository.AddUser(employeeToAdd);
            return Ok();
        }

        [HttpGet]
        [Route("edit")]
        public IHttpActionResult GetEmployeeToEdit(int id)
        {
            return Ok(_employeeRepository.GetUser(id));
        }

        [HttpPost]
        [Route("edit")]
        public IHttpActionResult EditEmployee(User editedEmployee)
        {
            _employeeRepository.EditUser(editedEmployee);
            return Ok();
        }

        [HttpDelete]
        [Route("delete")]
        public IHttpActionResult DeleteEmployee(int id)
        {
            _employeeRepository.DeleteUser(id);
            return Ok();
        }
    }
}
