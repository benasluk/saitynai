using System.ComponentModel.DataAnnotations;

namespace Plogger.Server.Models
{
    public class Session
    {
        public Guid Id { get; set; }
        public string LastRefreshToken { get; set; }
        public DateTimeOffset InitiatedAt { get; set; }

        public DateTimeOffset ExpiresAt { get; set; }
        public bool IsRevoked { get; set; }
        [Required]
        public string UserId { get; set; }
        public LoggerUser User { get; set; }
    }
}
