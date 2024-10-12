using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Plogger.Server.Models;
using System;

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

        [HttpGet]
        public async Task<IActionResult> GetPipelines()
        {
            var pipelines = await _context.Pipelines.Include(p => p.Logs).ThenInclude(l => l.Entries).ToListAsync();
            return Ok(pipelines);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPipeline(Guid id)
        {
            var pipeline = await _context.Pipelines.Include(p => p.Logs).ThenInclude(l => l.Entries)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (pipeline == null) return NotFound();
            return Ok(pipeline);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePipeline([FromBody] Pipeline pipeline)
        {
            pipeline.CreatedAt = DateTime.UtcNow;
            _context.Pipelines.Add(pipeline);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPipeline), new { id = pipeline.Id }, pipeline);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePipeline(Guid id, [FromBody] Pipeline pipeline)
        {
            if (id != pipeline.Id) return BadRequest();
            var existingPipeline = await _context.Pipelines.FindAsync(id);
            if (existingPipeline == null) return NotFound();

            existingPipeline.Name = pipeline.Name;
            _context.Pipelines.Update(existingPipeline);
            await _context.SaveChangesAsync();
            return NoContent();
        }

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
