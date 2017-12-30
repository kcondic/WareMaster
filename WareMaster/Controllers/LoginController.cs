using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Results;
using Jose;
using Newtonsoft.Json.Linq;
using WareMaster.Domain.Repositories;
using System.Net;
using System;
using System.Collections.Generic;
using System.Text;

namespace WareMaster.Controllers
{
    [RoutePrefix("api")]
    public class SigninController : ApiController
    {
        public SigninController()
        {
            _userRepository = new UserRepository();
        }
        private readonly UserRepository _userRepository;

        [HttpPost]
        [Route("login")]
        public IHttpActionResult Login(JObject userCredentials)
        {
            var userName = userCredentials["username"].ToObject<string>();
            var password = userCredentials["password"].ToObject<string>();

            var user = _userRepository.GetManagerByUsername(userName);
            if (user == null) return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.NotFound));

            var areCredentialsValid = password == user.Password;
            if (!areCredentialsValid) return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Forbidden));

            var span = DateTime.Now.Subtract(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc));
            var timestamp = Math.Round(span.TotalSeconds);
            var payload = new Dictionary<string, string>()
            {
                {"iss", "http://localhost:64748" },
                {"aud", "test" },
                {"exp", (timestamp + 10000).ToString()},
                {"role", user.Role.ToString()},
                {"id", user.Id.ToString()},
                {"username", user.Username},
                {"iat", timestamp.ToString()}
            };

            var token = JWT.Encode(payload, Encoding.UTF8.GetBytes("sTymnoTaSvFX6aI6Z86o9eh9IDbE8jCVwji7ypO5BmZUOF2jnCusXMjJWSbBQKf"), JwsAlgorithm.HS256);
            return Ok(token);
        }
    }
}