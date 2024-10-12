namespace Plogger.Server.Models
{
    public class Entry
    {
        public Guid Id { get; set; }
        public Guid LogId { get; set; }
        public string Message { get; set; }
        public int Status { get; set; }  // return code of the command log
        public DateTime CreatedAt { get; set; }

    }
}
