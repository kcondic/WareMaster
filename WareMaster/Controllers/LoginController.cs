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
                {"username", user.Username}
            };

            var token = JWT.Encode(payload, Encoding.UTF8.GetBytes(secret), JwsAlgorithm.HS256);
            return Ok(token);
        }

        [HttpPost]
        [Route("register")]
        public IHttpActionResult Register(JObject dataToRegister)
        {
            var companyName = dataToRegister["companyName"].ToObject<string>();
            var userToRegister = dataToRegister["newUser"].ToObject<User>();

            var companyId = _companyRepository.AddNewCompany(companyName);
            userToRegister.Company = _companyRepository.GetCompanyById(companyId);
            userToRegister.Password = HashHelper.HashPassword(userToRegister.Password);
            _userRepository.AddUser(userToRegister);
            return Ok(true);
        }
    }
}