using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Plogger.Server.Models;
using System;
using System.IO.Pipes;

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
        public async Task<IActionResult> GetPipelines()
        {
            var pipelines = await _context.Pipelines.Include(p => p.Logs).ThenInclude(l => l.Entries).ToListAsync();
            return Ok(pipelines);
        }

        // GET: api/pipelines/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPipeline(Guid id)
        {
            var pipeline = await _context.Pipelines.Include(p => p.Logs).ThenInclude(l => l.Entries)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (pipeline == null) return NotFound();
            return Ok(pipeline);
        }

        // POST: api/pipelines
        [HttpPost]
        public async Task<IActionResult> CreatePipeline([FromBody] Pipeline pipeline)
        {
            // Check for invalid log creation times compared to the pipeline
            foreach (var log in pipeline.Logs)
            {
                if (log.CreatedAt < pipeline.CreatedAt)
                {
                    return BadRequest($"Log creation date ({log.CreatedAt}) cannot be earlier than the pipeline creation date ({pipeline.CreatedAt}).");
                }
            }

            pipeline.Id = Guid.NewGuid();  // Assign a new unique ID
            if (pipeline.CreatedAt.Equals(DateTime.MinValue)) pipeline.CreatedAt = DateTime.UtcNow;
            _context.Pipelines.Add(pipeline);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPipeline), new { id = pipeline.Id }, pipeline);
        }

        // PUT: api/pipelines/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpsertPipeline(Guid id, [FromBody] Pipeline pipeline)
        {
            foreach (var log in pipeline.Logs)
            {
                if (log.CreatedAt < pipeline.CreatedAt)
                {
                    return BadRequest($"Log creation date ({log.CreatedAt}) cannot be earlier than the pipeline creation date ({pipeline.CreatedAt}).");
                }
            }

            var existingPipeline = await _context.Pipelines.FindAsync(id);

            if (existingPipeline == null)
            {
                pipeline.Id = id;
                if (pipeline.CreatedAt.Equals(DateTime.MinValue)) pipeline.CreatedAt = DateTime.UtcNow;
                _context.Pipelines.Add(pipeline);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetPipeline), new { id = pipeline.Id }, pipeline);
            }
            else
            {
                existingPipeline.Name = pipeline.Name;
                existingPipeline.Logs = pipeline.Logs;

                _context.Pipelines.Update(existingPipeline);
                await _context.SaveChangesAsync();

                return Ok(existingPipeline);
            }
        }

        // DELETE: api/pipelines/{id}
        [HttpDelete("{id}")]
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
