using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Plogger.Server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Plogger.Server.Auth
{
    public static class AuthEndpoints
    {
        public static void AddAuthApi(this WebApplication app)
        {
            app.MapPost("api/accounts", async (UserManager<LoggerUser> userManager, RegisterUserDTO dto) =>
            {
                var user = await userManager.FindByNameAsync(dto.UserName);
                if(user != null) 
                    return Results.UnprocessableEntity("User with username " + dto.UserName + " already exists.");

                var newUser = new LoggerUser()
                {
                    Email = dto.Email,
                    UserName = dto.UserName,
                    Company = dto.Company,
                };

                var createUserResult = await userManager.CreateAsync(newUser, dto.Password);
                if (!createUserResult.Succeeded)
                    return Results.UnprocessableEntity();

                foreach (var role in dto.roles)
                {
                    // Validate against LoggerRoles.All
                    if (!LoggerRoles.All.Contains(role))
                    {
                        return Results.UnprocessableEntity($"Invalid role: {role}");
                    }

                    // Add the valid role to the user
                    await userManager.AddToRoleAsync(newUser, role);
                }


                return Results.Created();
            });

            app.MapPost("api/login", async (UserManager<LoggerUser> userManager, JwtTokenService jwtTokenService, 
                HttpContext httpContext, SessionService sessionService, LoginDTO dto) =>
            {
                var user = await userManager.FindByNameAsync(dto.UserName);
                if (user == null)
                    return Results.UnprocessableEntity("User with username " + dto.UserName + " does not exist.");

                var isPasswordValid = await userManager.CheckPasswordAsync(user, dto.Password);
                if(!isPasswordValid) return Results.UnprocessableEntity("Password is incorrect");

                var roles = await userManager.GetRolesAsync(user);

                var sessionId = Guid.NewGuid();
                var expiresAt = DateTime.UtcNow.AddDays(3);
                var accessToken = jwtTokenService.CreateAccessToken(user.UserName, user.Id, roles);
                var refreshToken = jwtTokenService.CreateRefreshToken(sessionId, user.Id, expiresAt);

                await sessionService.CreateSessionAsync(sessionId, user.Id, refreshToken, expiresAt);

                var cookieOptions = new CookieOptions
                {
                    Path = "/",
                    Domain = "100.87.158.113",
                    HttpOnly = true,
                    SameSite = SameSiteMode.None,
                    Expires = expiresAt,
                    Secure = true,

                };

                httpContext.Response.Cookies.Append("RefreshToken", refreshToken, cookieOptions);

                return Results.Ok(new SuccessfulLoginDTO(accessToken));
            });

            app.MapPost("api/accessToken", async (UserManager<LoggerUser> userManager, SessionService sessionService, 
                JwtTokenService jwtTokenService, HttpContext httpContext) =>
            {
                if (!httpContext.Request.Cookies.TryGetValue("RefreshToken", out var refreshToken)) return Results.UnprocessableEntity();

                if(!jwtTokenService.TryParseRefreshToken(refreshToken, out var claims)) return Results.UnprocessableEntity();

                var sessionId = claims.FindFirstValue("SessionId");
                if(string.IsNullOrWhiteSpace(sessionId)) return Results.UnprocessableEntity();

                var sessionIdAsGuid = Guid.Parse(sessionId);
                if (!await sessionService.IsSessionValidAsync(sessionIdAsGuid, refreshToken)) return Results.UnprocessableEntity();

                var userId = claims.FindFirstValue(JwtRegisteredClaimNames.Sub);
                var user = await userManager.FindByIdAsync(userId);
                if(user == null) return Results.UnprocessableEntity();

                var roles = await userManager.GetRolesAsync(user);

                var expiresAt = DateTime.UtcNow.AddDays(3);
                var accessToken = jwtTokenService.CreateAccessToken(user.UserName, user.Id, roles);
                var newRefreshToken = jwtTokenService.CreateRefreshToken(sessionIdAsGuid, user.Id, expiresAt);

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    SameSite = SameSiteMode.Lax,
                    Expires = expiresAt,
                    Secure = false,

                };

                httpContext.Response.Cookies.Append("RefreshToken", newRefreshToken, cookieOptions);

                await sessionService.ExtendSessionAsync(sessionIdAsGuid, newRefreshToken, expiresAt);

                return Results.Ok(new SuccessfulLoginDTO(accessToken));
            });

            app.MapPost("api/logout", async (UserManager<LoggerUser> userManager, SessionService sessionService,
               JwtTokenService jwtTokenService, HttpContext httpContext) =>
            {
                if (!httpContext.Request.Cookies.TryGetValue("RefreshToken", out var refreshToken)) return Results.UnprocessableEntity();

                if (!jwtTokenService.TryParseRefreshToken(refreshToken, out var claims)) return Results.UnprocessableEntity();

                var sessionId = claims.FindFirstValue("SessionId");
                if (string.IsNullOrWhiteSpace(sessionId)) return Results.UnprocessableEntity();
                
                await sessionService.InvalidateSessionAsync(Guid.Parse(sessionId));
                httpContext.Response.Cookies.Delete("RefreshToken");

                return Results.Ok();
            });
        }
    }

    public record RegisterUserDTO(string UserName, string Email, string Password, string Company, List<string> roles);
    public record LoginDTO(string UserName, string Password);
    public record SuccessfulLoginDTO(string AccessToken);
}
