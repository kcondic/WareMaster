using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Results;
using Jose;
using Newtonsoft.Json.Linq;
using WareMaster.Domain.Repositories;
using System.Net;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using WareMaster.Data.Models.Entities;

namespace WareMaster.Controllers
{
    [RoutePrefix("api")]
    public class SigninController : ApiController
    {
        public SigninController()
        {
            _userRepository = new UserRepository();
            _companyRepository = new CompanyRepository();
        }
        private readonly UserRepository _userRepository;
        private readonly CompanyRepository _companyRepository;

        [HttpPost]
        [Route("password")]
        [Authorize]
        public IHttpActionResult ChangePassword(JObject dataToChange)
        {
            if (dataToChange["oldPassword"] == null || dataToChange["newPassword"] == null || dataToChange["userId"] == null)
                return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.BadRequest));
            var oldPassword = dataToChange["oldPassword"].ToObject<string>();
            var newPassword = dataToChange["newPassword"].ToObject<string>();
            var userId = dataToChange["userId"].ToObject<int>();

            var userToChangePassword = _userRepository.GetUser(userId);
            if (HashHelper.ValidatePassword(oldPassword, userToChangePassword.Password) &&
                char.IsLetter(newPassword[0]) && newPassword.Length >= 6 && Regex.IsMatch(newPassword, @"^[a-zA-Z0-9]+$"))
            {
                var hashedNewPassword = HashHelper.HashPassword(newPassword);
                userToChangePassword.Password = hashedNewPassword;
                _userRepository.EditUser(userToChangePassword);
                return Ok(true);
            }
            return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Forbidden));
        }

        [HttpGet]
        [Route("managers")]
        [Authorize]
        public IHttpActionResult GetManagers(int companyId)
        {
            return Ok(_userRepository.GetAllManagers(companyId));
        }

        [HttpDelete]
        [Route("managers")]
        [Authorize]
        public IHttpActionResult DeleteManager(int managerId)
        {
            _userRepository.DeleteUser(managerId);
            return Ok(true);
        }

        [HttpPost]
        [Route("login")]
        public IHttpActionResult Login(JObject userCredentials)
        {
            if(userCredentials["username"] == null || userCredentials["password"] == null)
                return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.NotFound));

            var userName = userCredentials["username"].ToObject<string>();
            var password = userCredentials["password"].ToObject<string>();

            var user = _userRepository.GetByUsername(userName);
            if (user == null) return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.NotFound));

            var areCredentialsValid = HashHelper.ValidatePassword(password, user.Password);
            if (!areCredentialsValid) return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Unauthorized));

            var issuer = ConfigurationManager.AppSettings["as:IssuerId"];
            var audience = ConfigurationManager.AppSettings["as:AudienceId"];
            var secret = ConfigurationManager.AppSettings["as:SecretToken"];
            var span = DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc));
            var timestamp = Math.Round(span.TotalSeconds);
            var payload = new Dictionary<string, string>()
            {
                {"iss", issuer},
                {"aud", audience},
                {"exp", (timestamp + 28800).ToString()},
                {"id", user.Id.ToString()},
                {"companyid", user.CompanyId.ToString()},
                {"companyname", _companyRepository.GetCompanyById(user.CompanyId).Name},
                {"username", user.Username},
                {"firstname", user.FirstName},
                {"lastname", user.LastName},
                {"role", user.Role.ToString()}
            };

            var token = JWT.Encode(payload, Encoding.UTF8.GetBytes(secret), JwsAlgorithm.HS256);
            return Ok(token);
        }

        [HttpGet]
        [Route("register")]
        public IHttpActionResult CheckIfUsernameExists(string username)
        {
            return Ok(_userRepository.DoesUsernameExist(username));
        }

        [HttpPost]
        [Route("register")]
        public IHttpActionResult Register(JObject dataToRegister)
        {
            if (dataToRegister["companyName"] == null || dataToRegister["newUser"] == null)
                return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Forbidden));
            var companyName = dataToRegister["companyName"].ToObject<string>();
            var userToRegister = dataToRegister["newUser"].ToObject<User>();

            var stringsToCheck = new List<string>()
            {
                companyName,
                userToRegister.Username,
                userToRegister.FirstName,
                userToRegister.LastName,
                userToRegister.Password
            };

            if(_userRepository.DoesUsernameExist(userToRegister.Username))
                return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Forbidden));
            if (stringsToCheck.Any(str => str == null || !char.IsLetter(str[0]) || !str.All(c =>  char.IsLetterOrDigit(c) || c==' ') || str.Length < 3))
                return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Forbidden));
            if(!Regex.IsMatch(userToRegister.Username, @"^[a-z0-9]+$"))
                return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Forbidden));
            if(userToRegister.Password.Length < 6 || !Regex.IsMatch(userToRegister.Password, @"^[a-zA-Z0-9]+$"))
                return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Forbidden));

            var companyId = _companyRepository.AddNewCompany(companyName);
            userToRegister.CompanyId = companyId;
            userToRegister.Password = HashHelper.HashPassword(userToRegister.Password);
            _userRepository.AddUser(userToRegister);
            return Ok(true);
        }

        [HttpPost]
        [Route("registerexisting")]
        [Authorize]
        public IHttpActionResult RegisterExisting(User userToRegisterToExistingCompany)
        {
            var stringsToCheck = new List<string>()
            {
                userToRegisterToExistingCompany.Username,
                userToRegisterToExistingCompany.FirstName,
                userToRegisterToExistingCompany.LastName,
                userToRegisterToExistingCompany.Password
            };

            if (_userRepository.DoesUsernameExist(userToRegisterToExistingCompany.Username))
                return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Forbidden));
            if (stringsToCheck.Any(str => str == null || !char.IsLetter(str[0]) || !str.All(c => char.IsLetterOrDigit(c) || c == ' ') || str.Length < 3))
                return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Forbidden));
            if (userToRegisterToExistingCompany.Username.Any(char.IsUpper) || !Regex.IsMatch(userToRegisterToExistingCompany.Username, @"^[a-z0-9]+$"))
                return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Forbidden));
            if (userToRegisterToExistingCompany.Password.Length < 6 || !Regex.IsMatch(userToRegisterToExistingCompany.Password, @"^[a-zA-Z0-9]+$"))
                return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Forbidden));

            userToRegisterToExistingCompany.Password = HashHelper.HashPassword(userToRegisterToExistingCompany.Password);
            _userRepository.AddUser(userToRegisterToExistingCompany);
            return Ok(true);
        }

        [HttpPost]
        [Route("registeremployee")]
        public IHttpActionResult RegisterEmployee(JObject accessStringAndCredentials)
        {
            if (accessStringAndCredentials["accessString"] == null 
                || accessStringAndCredentials["usernameToRegister"] == null 
                || accessStringAndCredentials["passwordToRegister"] == null)
                    return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Forbidden));
            var accessString = accessStringAndCredentials["accessString"].ToObject<string>();
            var usernameToRegister = accessStringAndCredentials["usernameToRegister"].ToObject<string>();
            var passwordToRegister = accessStringAndCredentials["passwordToRegister"].ToObject<string>();
   
            var idFromAccessString = 0;
            int.TryParse(Regex.Match(accessString, @"\d+$").Value, out idFromAccessString);

            var employeeToRegister = _userRepository.GetUser(idFromAccessString);
            if(employeeToRegister == null)
                return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.NotFound));

            if (_userRepository.DoesUsernameExist(usernameToRegister))
                return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Forbidden));
            if (employeeToRegister.Username != null || employeeToRegister.Password != null)
                return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Forbidden));
            if (accessString != char.ToLower(StringHelper.RemoveDiacritics(employeeToRegister.FirstName)[0]) + StringHelper.RemoveDiacritics(employeeToRegister.LastName).ToLower() + employeeToRegister.Id)
                return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Forbidden));
            if(usernameToRegister == null || !char.IsLetter(usernameToRegister[0]) || !Regex.IsMatch(usernameToRegister, @"^[a-z0-9]+$") || usernameToRegister.Length < 3)
                return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Forbidden));
            if (passwordToRegister.Length < 6 || !Regex.IsMatch(passwordToRegister, @"^[a-zA-Z0-9]+$"))
                return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Forbidden));

            employeeToRegister.Username = usernameToRegister;
            employeeToRegister.Password = HashHelper.HashPassword(passwordToRegister);
            _userRepository.EditUser(employeeToRegister);
 
            return Ok(true);
        }
    }
}