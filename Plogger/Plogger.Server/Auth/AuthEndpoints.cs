using Microsoft.AspNetCore.Identity;
using Plogger.Server.Models;

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

                await userManager.AddToRoleAsync(newUser, LoggerRoles.Client);

                return Results.Created();
            });

            app.MapPost("api/login", async (UserManager<LoggerUser> userManager, JwtTokenService jwtTokenService, LoginDTO dto) =>
            {
                var user = await userManager.FindByNameAsync(dto.UserName);
                if (user == null)
                    return Results.UnprocessableEntity("User with username " + dto.UserName + " does not exist.");

                var isPasswordValid = await userManager.CheckPasswordAsync(user, dto.Password);
                if(!isPasswordValid) return Results.UnprocessableEntity("Password is incorrect");

                var roles = await userManager.GetRolesAsync(user);

                var accessToken = jwtTokenService.CreateAccessToken(user.UserName, user.Id, roles);

                return Results.Ok(new SuccessfulLoginDTO(accessToken));
            });
        }
    }

    public record RegisterUserDTO(string UserName, string Email, string Password, string Company);
    public record LoginDTO(string UserName, string Password);
    public record SuccessfulLoginDTO(string AccessToken);
}
