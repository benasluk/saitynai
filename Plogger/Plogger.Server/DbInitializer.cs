using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Plogger.Server.Models;
using System;

namespace Plogger.Server
{
    public class DbInitializer
    {
        private readonly UserManager<LoggerUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public DbInitializer(UserManager<LoggerUser> userManager, RoleManager<IdentityRole> roleManager) 
        { 
            _userManager = userManager;
            _roleManager = roleManager;
        }

        private async Task AddAdminUserAsync(AppDBContext context)
        {
            var newAdminUser = new LoggerUser()
            {
                UserName = "admin",
                Email = "admin@admin.com",
                Company = "KTU"
            };

            var existAdminUser = await _userManager.FindByNameAsync(newAdminUser.UserName);
            if (existAdminUser == null)
            {
                var createAdminUserResult = await _userManager.CreateAsync(newAdminUser, "Admin123!");
                if (createAdminUserResult.Succeeded)
                {
                    await _userManager.AddToRolesAsync(newAdminUser, LoggerRoles.All);
                    await context.SaveChangesAsync();
                }
            }
        }

        private async Task AddDefaultRolesAsync()
        {
            foreach (var role in LoggerRoles.All)
            {
                var roleExists = await _roleManager.RoleExistsAsync(role);
                if (!roleExists) await _roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        public async Task Initialize(AppDBContext context)
        {
            context.Database.EnsureCreated();

            LoggerUser mainUser;

            if(!context.Users.Any())
            {
                await AddDefaultRolesAsync();
                await AddAdminUserAsync(context);
            }

            if (context.Users.FirstOrDefault((LoggerUser u) => u.UserName == "client1") == null)
            {
                var clientUser = new LoggerUser
                {
                    UserName = "client1",
                    Email = "client@company.com",
                    Company = "KTU",
                };

                var createMainUserResult = await _userManager.CreateAsync(clientUser, "JustAclient1!");
                if (createMainUserResult.Succeeded)
                {
                    await _userManager.AddToRoleAsync(clientUser, LoggerRoles.Client);
                    await context.SaveChangesAsync();
                }
            }

            if (context.Users.FirstOrDefault((LoggerUser u) => u.UserName == "developer1") == null)
            {
                mainUser = new LoggerUser
                {
                    UserName = "developer1",
                    Email = "dev@company.com",
                    Company = "KTU",
                };

                var createMainUserResult = await _userManager.CreateAsync(mainUser, "Devops123!");
                if (createMainUserResult.Succeeded)
                {
                    await _userManager.AddToRoleAsync(mainUser, LoggerRoles.Developer);
                    await _userManager.AddToRoleAsync(mainUser, LoggerRoles.Client);
                    await context.SaveChangesAsync();
                }
            }

            else mainUser = context.Users.FirstOrDefault((LoggerUser u) => u.UserName == "developer1");

            if (context.Pipelines.Any())
            {
                return;
            }

            Guid toUpdateId = Guid.Parse("91de2713-676b-4f88-a034-270b66074171");
            Guid toDeleteId = Guid.Parse("91de2713-676b-4f88-b254-270b66074171");

            var pipelines = new Pipeline[]
            {
            new Pipeline
            {
                Id = toUpdateId,
                Name = "CI Pipeline",
                CreatedAt = DateTime.UtcNow.AddHours(-3),
                UserId = mainUser.Id,
                User = mainUser
            },
            new Pipeline
            {
                Id = toDeleteId,
                Name = "CD Pipeline",
                CreatedAt = DateTime.UtcNow.AddHours(-2),
                UserId = mainUser.Id,
                User = mainUser
            }
            };

            context.Pipelines.AddRange(pipelines);

            var logToUpdateId = Guid.Parse("91de2713-676b-4f88-a034-270b66084671");
            var logToDeleteId = Guid.Parse("91de2713-676b-4f88-b321-270b66084671");

            var logsForPipeline1 = new Log[]
            {
            new Log
            {
                Id = logToUpdateId,
                Description = "Build Phase",
                PipelineId = toUpdateId,
                CreatedAt = DateTime.UtcNow.AddHours(-2),
                UserId = mainUser.Id,
                User = mainUser
            },
            new Log
            {
                Id = logToDeleteId,
                Description = "Test Phase",
                PipelineId = toUpdateId,
                CreatedAt = DateTime.UtcNow.AddHours(-1),
                UserId = mainUser.Id,
                User = mainUser
            }
            };

            context.Logs.AddRange(logsForPipeline1);

            var entryToUpdateId = Guid.Parse("91de2713-676b-4f88-a034-270b62584671");
            var entryToDeleteId = Guid.Parse("91de2713-676b-4f88-c315-270b62584671");

            var entriesForLog1 = new Entry[]
            {
            new Entry
            {
                Id = entryToUpdateId,
                Message = "Build started",
                Status = 0,
                CreatedAt = DateTime.UtcNow.AddHours(-2).AddMinutes(5),
                LogId = logToUpdateId,
                UserId = mainUser.Id,
                User = mainUser
            },
            new Entry
            {
                Id = entryToDeleteId,
                Message = "Build completed",
                Status = 0,
                CreatedAt = DateTime.UtcNow.AddHours(-2).AddMinutes(20),
                LogId = logToUpdateId,
                UserId = mainUser.Id,
                User = mainUser
            }
            };

            // Create Entries for Log 2
            var entriesForLog2 = new Entry[]
            {
            new Entry
            {
                Message = "Test started",
                Status = 0,
                CreatedAt = DateTime.UtcNow.AddHours(-1).AddMinutes(5),
                LogId = logToDeleteId,
                UserId = mainUser.Id,
                User = mainUser
            },
            new Entry
            {
                Message = "Test completed",
                Status = 0,
                CreatedAt = DateTime.UtcNow.AddHours(-1).AddMinutes(30),
                LogId = logToDeleteId,
                UserId = mainUser.Id,
                User = mainUser
            }
            };

            context.Entries.AddRange(entriesForLog1);
            context.Entries.AddRange(entriesForLog2);

            var log3Id = Guid.NewGuid();
            var log4Id = Guid.NewGuid();

            var logsForPipeline2 = new Log[]
            {
            new Log
            {
                Id = log3Id,
                Description = "Deploy Phase",
                PipelineId = toDeleteId,
                CreatedAt = DateTime.UtcNow.AddMinutes(-45),
                UserId = mainUser.Id,
                User = mainUser
            },
            new Log
            {
                Id = log4Id,
                Description = "Monitoring Phase",
                PipelineId = toDeleteId,
                CreatedAt = DateTime.UtcNow.AddMinutes(-15),
                UserId = mainUser.Id,
                User = mainUser
            }
            };

            context.Logs.AddRange(logsForPipeline2);

            var entriesForLog3 = new Entry[]
            {
            new Entry
            {
                Message = "Deploy started",
                Status = 0,
                CreatedAt = DateTime.UtcNow.AddMinutes(-45).AddMinutes(5),
                LogId = log3Id,
                UserId = mainUser.Id,
                User = mainUser
            },
            new Entry
            {
                Message = "Deploy completed",
                Status = 0,
                CreatedAt = DateTime.UtcNow.AddMinutes(-45).AddMinutes(20),
                LogId = log3Id,
                UserId = mainUser.Id,
                User = mainUser
            }
            };

            var entriesForLog4 = new Entry[]
            {
            new Entry
            {
                Message = "Monitoring started",
                Status = 0,
                CreatedAt = DateTime.UtcNow.AddMinutes(-15).AddMinutes(5),
                LogId = log4Id,
                UserId = mainUser.Id,
                User = mainUser
            },
            new Entry
            {
                Message = "Monitoring completed",
                Status = 0,
                CreatedAt = DateTime.UtcNow.AddMinutes(-15).AddMinutes(10),
                LogId = log4Id,
                UserId = mainUser.Id,
                User = mainUser
            }
            };

            context.Entries.AddRange(entriesForLog3);
            context.Entries.AddRange(entriesForLog4);

            context.SaveChanges();
        }
    }

}
