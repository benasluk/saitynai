using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace Plogger.Server.Auth
{
    public class JwtTokenService
    {
        private readonly SymmetricSecurityKey _authSigningKey;
        private readonly string? _issuer;
        private readonly string? _audience;
        public JwtTokenService(IConfiguration config)
        {
            _authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Secret"]));
            _issuer = config["Jwt:ValidIssuer"];
            _audience = config["Jwt:ValidAudience"];
        }

        public string CreateAccessToken(string userName, string userId, IEnumerable<string> roles)
        {
            var authClaims = new List<Claim>
            {
                new(ClaimTypes.Name, userName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, userId)
            };

            authClaims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

            var token = new JwtSecurityToken(
                issuer: _issuer,
                audience: _audience,
                expires: DateTime.Now.AddMinutes(15),
                claims: authClaims,
                signingCredentials: new SigningCredentials(_authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string CreateRefreshToken(Guid sessionId, string userId, DateTime expires)
        {
            var authClaims = new List<Claim>()
            {
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new(JwtRegisteredClaimNames.Sub, userId),
                new("SessionId", sessionId.ToString())
            };

            var token = new JwtSecurityToken(
                 issuer: _issuer,
                 audience: _audience,
                 expires: expires,
                 claims: authClaims,
                 signingCredentials: new SigningCredentials(_authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public bool TryParseRefreshToken(string refreshToken, out ClaimsPrincipal? claims)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler{ MapInboundClaims = false };
                var validationParameters = new TokenValidationParameters()
                {
                    ValidIssuer = _issuer,
                    ValidAudience = _audience,
                    IssuerSigningKey = _authSigningKey,
                    ValidateLifetime = true
                };

                claims = tokenHandler.ValidateToken(refreshToken, validationParameters, out _);
                return true;
            }
            catch (Exception e)
            {
                claims = null;
                Console.WriteLine(e);
                return false;
            }
        }   
    }
}
