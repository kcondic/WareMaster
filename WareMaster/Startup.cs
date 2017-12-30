using System;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(WareMaster.Startup))]

namespace WareMaster
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {

            // The key length needs to be of sufficient length, or otherwise an error will occur.
            var tokenSecretKey = Encoding.UTF8.GetBytes("sTymnoTaSvFX6aI6Z86o9eh9IDbE8jCVwji7ypO5BmZUOF2jnCusXMjJWSbBQKf");

            var tokenValidationParameters = new TokenValidationParameters
            {
                // Token signature will be verified using a private key.
                ValidateIssuerSigningKey = true,
                RequireSignedTokens = true,
                IssuerSigningKey = new SymmetricSecurityKey(tokenSecretKey),

                ValidateActor = false
            };

            app.UseJwtBearerAuthentication(new JwtBearerOptions
            {
                AutomaticAuthenticate = true,
                TokenValidationParameters = tokenValidationParameters
            });
        }
    }
}
