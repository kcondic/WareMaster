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
    }
}
