using Plogger.Server.Models;
using System;

namespace Plogger.Server
{
    public class DbInitializer
    {
        public static void Initialize(AppDBContext context)
        {
            context.Database.EnsureCreated();

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
                CreatedAt = DateTime.UtcNow.AddHours(-3)
            },
            new Pipeline
            {
                Id = toDeleteId,
                Name = "CD Pipeline",
                CreatedAt = DateTime.UtcNow.AddHours(-2)
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
                CreatedAt = DateTime.UtcNow.AddHours(-2)
            },
            new Log
            {
                Id = logToDeleteId,
                Description = "Test Phase",
                PipelineId = toUpdateId,
                CreatedAt = DateTime.UtcNow.AddHours(-1)
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
                LogId = logToUpdateId
            },
            new Entry
            {
                Id = entryToDeleteId,
                Message = "Build completed",
                Status = 0,
                CreatedAt = DateTime.UtcNow.AddHours(-2).AddMinutes(20),
                LogId = logToUpdateId
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
                LogId = logToDeleteId
            },
            new Entry
            {
                Message = "Test completed",
                Status = 0,
                CreatedAt = DateTime.UtcNow.AddHours(-1).AddMinutes(30),
                LogId = logToDeleteId
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
                CreatedAt = DateTime.UtcNow.AddMinutes(-45)
            },
            new Log
            {
                Id = log4Id,
                Description = "Monitoring Phase",
                PipelineId = toDeleteId,
                CreatedAt = DateTime.UtcNow.AddMinutes(-15)
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
                LogId = log3Id
            },
            new Entry
            {
                Message = "Deploy completed",
                Status = 0,
                CreatedAt = DateTime.UtcNow.AddMinutes(-45).AddMinutes(20),
                LogId = log3Id
            }
            };

            var entriesForLog4 = new Entry[]
            {
            new Entry
            {
                Message = "Monitoring started",
                Status = 0,
                CreatedAt = DateTime.UtcNow.AddMinutes(-15).AddMinutes(5),
                LogId = log4Id
            },
            new Entry
            {
                Message = "Monitoring completed",
                Status = 0,
                CreatedAt = DateTime.UtcNow.AddMinutes(-15).AddMinutes(10),
                LogId = log4Id
            }
            };

            context.Entries.AddRange(entriesForLog3);
            context.Entries.AddRange(entriesForLog4);

            context.SaveChanges();
        }
    }

}
