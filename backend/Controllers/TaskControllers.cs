using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskApi.Models;
using TaskApi.Data;

namespace TaskApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // => /api/tasks
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _db;
        public TasksController(AppDbContext db) => _db = db;

        // Read All : Get /api/tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetAll()
        {
            var items = await _db.Tasks
                .OrderBy(t => t.IsDone)
                .ThenBy(t => t.DueDate)
                .ToListAsync();

            return Ok(items);
        }

        // Read One : Get /api/tasks/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<TaskItem>> GetById(int id)
        {
            var item = await _db.Tasks.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        // Create : Post /api/tasks
        [HttpPost]
        public async Task<ActionResult<TaskItem>> Create(TaskItem dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title)) return BadRequest("Title is required.");

            _db.Tasks.Add(dto);

            await _db.SaveChangesAsync();

            // Returns 201 with Location Header pointing to Get By Id
            return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
        }

        // Update : Put /api/tasks/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, TaskItem dto)
        {
            if (id != dto.Id) return BadRequest("ID mismatch.");

            var exists = await _db.Tasks.AnyAsync(t => t.Id == id);
            if (!exists) return NotFound();

            _db.Entry(dto).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            // 204 No Content means success with no body
            return NoContent();
        }


        // Delete : Delete /api/tasks/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.Tasks.FindAsync(id);
            if (item == null) return NotFound();

            _db.Tasks.Remove(item);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}