using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Plogger.Server.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.IO.Pipes;
using System.Security.Claims;

namespace Plogger.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PipelinesController : ControllerBase
    {
        private readonly AppDBContext _context;

        public PipelinesController(AppDBContext context)
        {
            _context = context;
        }

        // GET: api/pipelines
        [HttpGet]
        [Authorize(Roles = LoggerRoles.Client)]
        public async Task<IActionResult> GetPipelines()
        {
            var pipelines = await _context.Pipelines.Include(p => p.Logs).ThenInclude(l => l.Entries).ToListAsync();
            return Ok(pipelines);
        }

        // GET: api/pipelines/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = LoggerRoles.Client)]
        public async Task<IActionResult> GetPipeline(Guid id)
        {
            var pipeline = await _context.Pipelines.Include(p => p.Logs).ThenInclude(l => l.Entries)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (pipeline == null) return NotFound();
            return Ok(pipeline);
        }

        // POST: api/pipelines
        [HttpPost]
        [Authorize(Roles = LoggerRoles.Developer)]
        public async Task<IActionResult> CreatePipeline([FromBody] Pipeline pipeline)
        {
            pipeline.Id = Guid.NewGuid();
            pipeline.UserId = HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (pipeline.CreatedAt.Equals(DateTime.MinValue)) pipeline.CreatedAt = DateTime.UtcNow;

            foreach (var log in pipeline.Logs)
            {
                if(log.CreatedAt.Equals(DateTime.MinValue)) log.CreatedAt = DateTime.UtcNow;
                if (string.IsNullOrEmpty(log.UserId)) log.UserId = HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub);
                if (log.CreatedAt < pipeline.CreatedAt)
                {
                    return UnprocessableEntity($"Log creation date ({log.CreatedAt}) cannot be earlier than the pipeline creation date ({pipeline.CreatedAt}).");
                }
                foreach (var entry in log.Entries)
                {
                    if (string.IsNullOrEmpty(entry.UserId)) entry.UserId = log.UserId;
                }
            }

            _context.Pipelines.Add(pipeline);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPipeline), new { id = pipeline.Id }, pipeline);
        }

        // PUT: api/pipelines/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = LoggerRoles.Developer)]
        public async Task<IActionResult> UpsertPipeline(Guid id, [FromBody] Pipeline pipeline)
        {
            var existingPipeline = await _context.Pipelines.FindAsync(id);
            if (pipeline.CreatedAt.Equals(DateTime.MinValue) && existingPipeline != null) pipeline.CreatedAt = existingPipeline.CreatedAt;
            else if (pipeline.CreatedAt.Equals(DateTime.MinValue)) pipeline.CreatedAt = DateTime.UtcNow;

            foreach (var log in pipeline.Logs)
            {
                if (log.CreatedAt.Equals(DateTime.MinValue)) log.CreatedAt = DateTime.UtcNow;
                if (string.IsNullOrEmpty(log.UserId)) log.UserId = HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub);
                if (log.CreatedAt < pipeline.CreatedAt)
                {
                    return UnprocessableEntity($"Log creation date ({log.CreatedAt}) cannot be earlier than the pipeline creation date ({pipeline.CreatedAt}).");
                }
                foreach (var entry in log.Entries)
                {
                    if (entry.UserId == null) entry.UserId = log.UserId;
                }
            }

            if (existingPipeline == null)
            {
                pipeline.Id = id;
                pipeline.UserId = HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub);
                if (pipeline.CreatedAt.Equals(DateTime.MinValue)) pipeline.CreatedAt = DateTime.UtcNow;
                _context.Pipelines.Add(pipeline);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetPipeline), new { id = pipeline.Id }, pipeline);
            }
            else
            {
                if (existingPipeline.UserId != HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) &&
                    !HttpContext.User.IsInRole(LoggerRoles.Admin))
                    return Forbid();
                existingPipeline.Name = pipeline.Name;
                existingPipeline.Logs = pipeline.Logs;

                foreach (var log in pipeline.Logs)
                {
                    if (log.CreatedAt.Equals(DateTime.MinValue)) log.CreatedAt = DateTime.UtcNow;
                    if (string.IsNullOrEmpty(log.UserId)) log.UserId = HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub);
                    if (log.CreatedAt < pipeline.CreatedAt)
                    {
                        return UnprocessableEntity($"Log creation date ({log.CreatedAt}) cannot be earlier than the pipeline creation date ({pipeline.CreatedAt}).");
                    }
                    foreach (var entry in log.Entries)
                    {
                        if (string.IsNullOrEmpty(entry.UserId)) entry.UserId = log.UserId;
                    }
                }



                _context.Pipelines.Update(existingPipeline);
                await _context.SaveChangesAsync();

                return Ok(existingPipeline);
            }
        }

        // DELETE: api/pipelines/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = LoggerRoles.Admin)]
        public async Task<IActionResult> DeletePipeline(Guid id)
        {
            var pipeline = await _context.Pipelines.FindAsync(id);
            if (pipeline == null) return NotFound();

            _context.Pipelines.Remove(pipeline);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
