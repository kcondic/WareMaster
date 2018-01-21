using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;
using WareMaster.Data.Models.Entities;
using WareMaster.Domain.Repositories;
using System.Linq;
using System.Threading.Tasks;

namespace WareMaster.Controllers
{
    [RoutePrefix("api/employees")]
    [Authorize]
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
        public IHttpActionResult GetAllEmployees(int companyId)
        {
            return Ok(_employeeRepository.GetAllEmployees(companyId));
        }

        [HttpPost]
        [Route("add")]
        public IHttpActionResult AddEmployee(User employeeToAdd)
        {
            var companyName = _companyRepository.GetCompanyById(employeeToAdd.CompanyId).Name;
            var employeeId = _employeeRepository.AddUser(employeeToAdd);
            employeeToAdd.ImageUrl = "Uploads\\" + companyName + "\\Zaposlenici\\" + 
                                      employeeToAdd.FirstName + employeeToAdd.LastName + 
                                      employeeId + ".jpg";
            _employeeRepository.EditUser(employeeToAdd);
            return Ok(char.ToLower(StringHelper.RemoveDiacritics(employeeToAdd.FirstName)[0]) 
                + StringHelper.RemoveDiacritics(employeeToAdd.LastName).ToLower() + employeeId);
        }

        [HttpGet]
        [Route("details")]
        public IHttpActionResult GetEmployeeDetails(int id, int companyId)
        {
            var user = _employeeRepository.GetUserDetails(id, companyId);
            if (user != null)
                return Ok(user);
            return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Unauthorized));
        }

        [HttpPost]
        [Route("edit")]
        public IHttpActionResult EditEmployee(User editedEmployee)
        {
            var uploadsFolder = HttpContext.Current.Server.MapPath("\\Uploads");
            var companyName = _companyRepository.GetCompanyById(editedEmployee.CompanyId).Name;
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
            var companyName = _companyRepository.GetCompanyById(_employeeRepository.GetUser(id).CompanyId).Name;
            var uploadsFolder = HttpContext.Current.Server.MapPath("\\Uploads");
            var companyFolder = Path.Combine(Path.Combine(uploadsFolder, companyName), "Zaposlenici");
            if (!Directory.Exists(companyFolder))
            {
                _employeeRepository.DeleteUser(id);
                return Ok(true);
            }
            var fileToDeleteFilter = @"*" + id + ".jpg";
            var fileToDelete = Directory.GetFiles(companyFolder, fileToDeleteFilter);
            if(fileToDelete.Any())
                File.Delete(fileToDelete[0]);
            _employeeRepository.DeleteUser(id);
            return Ok(true);
        }

        [HttpPost]
        [Route("upload")]
        public IHttpActionResult UploadImage(int companyId)
        {
            if (HttpContext.Current.Request.Files.Count > 0)
            {
                    var file = HttpContext.Current.Request.Files[0];
                    var companyName = _companyRepository.GetCompanyById(companyId).Name;
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
