using System.ComponentModel.DataAnnotations;

namespace TaskApi.Models
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public bool IsDone { get; set; } = false;
        public DateTime? DueDate { get; set; }

        [Required]
        [StringLength(50)]
        public string Category { get; set; } = "";

        public int EstimatedHours { get; set; } = 0;
    }
}