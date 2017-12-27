using System;
using System.IO;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using WareMaster.Data.Models.Entities;
using WareMaster.Domain.Repositories;
using System.Linq;
using System.Threading.Tasks;

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

        [HttpGet]
        [Route("add")]
        public IHttpActionResult GetIdNeededForImageName()
        {
            return Ok(_employeeRepository.GetLastEmployeeId());
        }

        [HttpPost]
        [Route("add")]
        public IHttpActionResult AddEmployee(User employeeToAdd)
        {
            var companyName = _companyRepository.GetCompanyById(1).Name;
            _employeeRepository.AddUser(employeeToAdd);
            var lastId = _employeeRepository.GetLastEmployeeId();
            employeeToAdd.ImageUrl = "Uploads\\" + companyName + "\\Zaposlenici\\" + 
                                      employeeToAdd.FirstName + employeeToAdd.LastName + 
                                      lastId + ".jpg";
            _employeeRepository.EditUser(employeeToAdd);
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
            var uploadsFolder = HttpContext.Current.Server.MapPath("\\Uploads");
            var companyName = _companyRepository.GetCompanyById(1).Name;
            var oldUrlOfImage = Path.Combine(Directory.GetParent(uploadsFolder).ToString(), editedEmployee.ImageUrl);
            var newUrlForImage = Path.Combine(Path.Combine(Path.Combine(uploadsFolder, companyName), "Zaposlenici"), 
                                 editedEmployee.FirstName + editedEmployee.LastName + editedEmployee.Id + ".jpg");

            if (File.Exists(oldUrlOfImage) && oldUrlOfImage != newUrlForImage)
                File.Move(oldUrlOfImage, newUrlForImage);

            editedEmployee.ImageUrl = "Uploads\\" + companyName + "\\Zaposlenici\\" + 
                                       editedEmployee.FirstName + editedEmployee.LastName
                                       + editedEmployee.Id + ".jpg";
            _employeeRepository.EditUser(editedEmployee);
            return Ok(true);
        }

        [HttpDelete]
        [Route("delete")]
        public IHttpActionResult DeleteEmployee(int id)
        {
            var companyName = _companyRepository.GetCompanyById(1).Name;
            var uploadsFolder = HttpContext.Current.Server.MapPath("\\Uploads");
            var companyFolder = Path.Combine(Path.Combine(uploadsFolder, companyName), "Zaposlenici");
            var fileToDeleteFilter = @"*" + id + ".jpg";
            var fileToDelete = Directory.GetFiles(companyFolder, fileToDeleteFilter);
            if(fileToDelete.Any())
                File.Delete(fileToDelete[0]);
            _employeeRepository.DeleteUser(id);
            return Ok(true);
        }

        [HttpPost]
        [Route("upload")]
        public IHttpActionResult UploadImage()
        {
            if (HttpContext.Current.Request.Files.Count > 0)
            {
                    var file = HttpContext.Current.Request.Files[0];
                    var companyName = _companyRepository.GetCompanyById(1).Name;
                    var uploadsFolder = HttpContext.Current.Server.MapPath("\\Uploads");
                    Directory.CreateDirectory(Path.Combine(Path.Combine(uploadsFolder, companyName), "Zaposlenici"));
                    var path = Path.Combine(Path.Combine(Path.Combine(uploadsFolder, companyName), "Zaposlenici"), file.FileName);

                    file.SaveAs(path);
                    file.InputStream.Close();
            }
            return Ok(true);
        }
    }
}
