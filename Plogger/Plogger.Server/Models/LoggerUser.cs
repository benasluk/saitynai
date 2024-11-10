using Microsoft.AspNetCore.Identity;

namespace Plogger.Server.Models
{
    public class LoggerUser : IdentityUser
    {
        public string Company { get; set; }

    }
}
