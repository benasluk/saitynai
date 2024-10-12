namespace Plogger.Server.Models
{
    public class Pipeline
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<Log> Logs { get; set; }
    }
}
