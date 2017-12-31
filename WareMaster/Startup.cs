using System;
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
            var issuer = "http://localhost:64748";
            var audienceId = "test";
            // The key length needs to be of sufficient length, or otherwise an error will occur.
            var tokenSecretKey = Encoding.UTF8.GetBytes("sTymnoTaSvFX6aI6Z86o9eh9IDbE8jCVwji7ypO5BmZUOF2jnCusXMjJWSbBQKf");

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
