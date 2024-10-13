using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Plogger.Server.Models;
using System;

namespace Plogger.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EntriesController : ControllerBase
    {
        private readonly AppDBContext _context;

        public EntriesController(AppDBContext context)
        {
            _context = context;
        }

        // GET: api/entries
        [HttpGet]
        public async Task<IActionResult> GetEntries()
        {
            var entries = await _context.Entries.ToListAsync();
            return Ok(entries);
        }

        // GET: api/entries/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEntry(Guid id)
        {
            var entry = await _context.Entries.FindAsync(id);

            if (entry == null) return NotFound();
            return Ok(entry);
        }

        // POST: api/entries
        [HttpPost]
        public async Task<IActionResult> CreateEntry([FromBody] Entry entry)
        {
            var log = await _context.Logs.FindAsync(entry.LogId);
            if (log == null)
            {
                return BadRequest($"Log with ID {entry.LogId} does not exist.");
            }

            if (entry.CreatedAt < log.CreatedAt)
            {
                return UnprocessableEntity($"Entry creation date ({entry.CreatedAt}) cannot be earlier than the log creation date ({log.CreatedAt}).");
            }

            entry.Id = Guid.NewGuid();
            _context.Entries.Add(entry);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEntry), new { id = entry.Id }, entry);
        }

        // PUT: api/entries/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEntry(Guid id, [FromBody] Entry entry)
        {
            if (id != entry.Id)
            {
                return BadRequest("Entry ID mismatch.");
            }

            var log = await _context.Logs.FindAsync(entry.LogId);
            if (log == null)
            {
                return BadRequest($"Log with ID {entry.LogId} does not exist.");
            }

            if (entry.CreatedAt < log.CreatedAt)
            {
                return UnprocessableEntity($"Entry creation date ({entry.CreatedAt}) cannot be earlier than the log creation date ({log.CreatedAt}).");
            }

            _context.Entry(entry).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return Ok(entry);
        }

        // DELETE: api/entries/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEntry(Guid id)
        {
            var entry = await _context.Entries.FindAsync(id);
            if (entry == null) return NotFound();

            _context.Entries.Remove(entry);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }

}
