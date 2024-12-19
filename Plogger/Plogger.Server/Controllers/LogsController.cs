using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using Plogger.Server.Models;
using System;
using System.Security.Claims;

namespace Plogger.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LogsController : ControllerBase
    {
        private readonly AppDBContext _context;

        public LogsController(AppDBContext context)
        {
            _context = context;
        }

        // GET: api/logs
        [HttpGet]
        [Authorize(Roles = LoggerRoles.Client)]
        public async Task<IActionResult> GetLogs()
        {
            var logs = await _context.Logs.Include(l => l.Entries).ToListAsync();
            return Ok(logs);
        }

        // GET: api/logs/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = LoggerRoles.Client)]
        public async Task<IActionResult> GetLog(Guid id)
        {
            var log = await _context.Logs.Include(l => l.Entries).FirstOrDefaultAsync(l => l.Id == id);

            if (log == null) return NotFound();
            return Ok(log);
        }

        // POST: api/logs
        [HttpPost]
        [Authorize(Roles = LoggerRoles.Developer)]
        public async Task<IActionResult> CreateLog([FromBody] Log log)
        {
            var pipeline = await _context.Pipelines.FindAsync(log.PipelineId);
            log.Id = Guid.NewGuid();
            if(log.CreatedAt.Equals(DateTime.MinValue)) log.CreatedAt = DateTime.UtcNow;

            if (pipeline == null)
            {
                return BadRequest($"Pipeline with id {log.PipelineId} does not exist.");
            }

            if (log.CreatedAt < pipeline.CreatedAt)
            {
                return UnprocessableEntity("Log creation date cannot be before the pipeline creation date.");
            }

            _context.Logs.Add(log);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLog), new { id = log.Id }, log);
        }

        // PUT: api/logs/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = LoggerRoles.Developer)]
        public async Task<IActionResult> UpsertLog(Guid id, [FromBody] Log log)
        {
            var existingLog = await _context.Logs.Include(l => l.Entries).FirstOrDefaultAsync(l => l.Id == id);
            if (log.CreatedAt.Equals(DateTime.MinValue) && existingLog != null) log.CreatedAt = existingLog.CreatedAt;
            else if (log.CreatedAt.Equals(DateTime.MinValue)) log.CreatedAt = DateTime.UtcNow;

            var pipeline = await _context.Pipelines.FindAsync(log.PipelineId);

            if (pipeline == null)
            {
                return BadRequest($"Pipeline with id {log.PipelineId} does not exist.");
            }

            if (log.CreatedAt < pipeline.CreatedAt)
            {
                return UnprocessableEntity("Log creation date cannot be before the pipeline creation date.");
            }


            if (existingLog == null)
            {
                log.Id = id;
                _context.Logs.Add(log);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetLog), new { id = log.Id }, log);
            }
            else
            {
                if (existingLog.UserId != HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) &&
                    !HttpContext.User.IsInRole(LoggerRoles.Admin))
                        return Forbid();

                existingLog.Description = log.Description;
                existingLog.Entries.Clear();
                foreach (var entry in log.Entries)
                {
                    existingLog.Entries.Add(entry);
                }
                existingLog.CreatedAt = log.CreatedAt;

                _context.Logs.Update(existingLog);
                await _context.SaveChangesAsync();

                return Ok(existingLog);
            }
        }

        // DELETE: api/logs/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = LoggerRoles.Admin)]
        public async Task<IActionResult> DeleteLog(Guid id)
        {
            var log = await _context.Logs.FindAsync(id);
            if (log == null) return NotFound();

            _context.Logs.Remove(log);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
