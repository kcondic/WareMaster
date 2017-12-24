using System;
using System.IO;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using WareMaster.Data.Models.Entities;
using WareMaster.Domain.Repositories;
using System.Linq;

namespace WareMaster.Controllers
{
    [RoutePrefix("api/employees")]
    public class EmployeesController : ApiController
    {
        public EmployeesController()
        {
            _employeeRepository = new UserRepository();
            _companyRepository = new CompanyRepository();
        }
        private readonly UserRepository _employeeRepository;
        private readonly CompanyRepository _companyRepository;

        [HttpGet]
        [Route("")]
        public IHttpActionResult GetAllEmployees()
        {
            return Ok(_employeeRepository.GetAllEmployees(1));
        }

        [HttpPost]
        [Route("add")]
        public IHttpActionResult AddEmployee(User employeeToAdd)
        {
            employeeToAdd.ImageUrl = "Uploads\\" + _companyRepository.GetCompanyById(1).Name + 
                                    "\\Zaposlenici\\" + employeeToAdd.FirstName + employeeToAdd.LastName + ".jpg";
            _employeeRepository.AddUser(employeeToAdd);
            return Ok(true);
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
            return Ok(true);
        }

        [HttpDelete]
        [Route("delete")]
        public IHttpActionResult DeleteEmployee(int id)
        {
            _employeeRepository.DeleteUser(id);
            return Ok(true);
        }

        [HttpPost]
        [Route("upload")]
        public IHttpActionResult UploadImage()
        {
            if (HttpContext.Current.Request.Files.Count>0)
            {
                var file = HttpContext.Current.Request.Files[0];
                var companyName = _companyRepository.GetCompanyById(1).Name;
                var uploadsFolder = HttpContext.Current.Server.MapPath("\\Uploads");
                Directory.CreateDirectory(uploadsFolder + "\\" + companyName + "\\Zaposlenici");
                var path = uploadsFolder + "\\" + companyName + "\\Zaposlenici\\" + file.FileName; 
                file.SaveAs(path);
            }       
            return Ok();
        }
    }
}
