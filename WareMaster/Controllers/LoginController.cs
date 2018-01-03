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
        [Route("login")]
        public IHttpActionResult Login(JObject userCredentials)
        {
            if(userCredentials["username"] == null || userCredentials["password"] == null)
                return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.NotFound));

            var userName = userCredentials["username"].ToObject<string>();
            var password = userCredentials["password"].ToObject<string>();

            var user = _userRepository.GetManagerByUsername(userName);
            if (user == null) return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.NotFound));

            var areCredentialsValid = HashHelper.ValidatePassword(password, user.Password);
            if (!areCredentialsValid) return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Forbidden));

            var issuer = ConfigurationManager.AppSettings["as:IssuerId"];
            var audience = ConfigurationManager.AppSettings["as:AudienceId"];
            var secret = ConfigurationManager.AppSettings["as:SecretToken"];
            var span = DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc));
            var timestamp = Math.Round(span.TotalSeconds);
            var payload = new Dictionary<string, string>()
            {
                {"iss", issuer},
                {"aud", audience},
                {"exp", (timestamp + 245000).ToString()},
                {"id", user.Id.ToString()},
                {"companyid", user.CompanyId.ToString()},
                {"username", user.Username}
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
                userToRegister.Username,
                userToRegister.FirstName,
                userToRegister.LastName,
                userToRegister.Password
            };

            if(stringsToCheck.Any(str => str == null || !char.IsLetter(str[0]) || !str.All(char.IsLetterOrDigit) || str.Length < 3))
                return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Forbidden));
            if(userToRegister.Username.Any(char.IsUpper) || Regex.IsMatch(userToRegister.Username, @"^[a-z0-9]+$"))
                return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Forbidden));
            if(userToRegister.Password.Length < 6)
                return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Forbidden));

            var companyId = _companyRepository.AddNewCompany(companyName);
            userToRegister.CompanyId = companyId;
            userToRegister.Password = HashHelper.HashPassword(userToRegister.Password);
            _userRepository.AddUser(userToRegister);
            return Ok(true);
        }
    }
}