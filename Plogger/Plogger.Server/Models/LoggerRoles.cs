namespace Plogger.Server.Models
{
    public class LoggerRoles
    {
        public const string Admin = nameof(Admin);
        public const string Client = nameof(Client);
        public const string Developer = nameof(Developer);

        public static readonly IReadOnlyCollection<string> All = new[] {Admin, Client, Developer};
    }
}
