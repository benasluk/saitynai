namespace Plogger.Server.Models
{
    public class Log
    {
        public Guid Id { get; set; }
        public Guid PipelineId { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<Entry> Entries { get; set; }
    }
}
