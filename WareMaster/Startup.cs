using System;
using System.Configuration;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using System.IdentityModel.Tokens;
using Microsoft.Owin;
using Microsoft.Owin.Security.Jwt;
using Owin;
using Microsoft.AspNetCore.Authentication.JwtBearer;

[assembly: OwinStartup(typeof(WareMaster.Startup))]

namespace WareMaster
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var issuer = ConfigurationManager.AppSettings["as:IssuerId"];
            var audienceId = ConfigurationManager.AppSettings["as:AudienceId"];
            var tokenSecretKey = Encoding.UTF8.GetBytes(ConfigurationManager.AppSettings["as:SecretToken"]);

            app.UseJwtBearerAuthentication(new JwtBearerAuthenticationOptions
            {
                AuthenticationMode = Microsoft.Owin.Security.AuthenticationMode.Active,
                AllowedAudiences = new[] { audienceId },
                IssuerSecurityTokenProviders = new IIssuerSecurityTokenProvider[]
                    {
                        new SymmetricKeyIssuerSecurityTokenProvider(issuer, tokenSecretKey)
                    }      
            });
        }
    }
}
