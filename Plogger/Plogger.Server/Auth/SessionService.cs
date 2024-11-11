using Plogger.Server.Helpers;
using Plogger.Server.Models;

namespace Plogger.Server.Auth
{
    public class SessionService(AppDBContext dbContext)
    {

        public async Task CreateSessionAsync(Guid sessionId, string userId, string refreshToken, DateTime expiresAt)
        {
            dbContext.Sessions.Add(new Session
            {
                Id = sessionId,
                UserId = userId,
                InitiatedAt = DateTimeOffset.UtcNow,
                ExpiresAt = expiresAt,
                LastRefreshToken = Converter.ToSHA256(refreshToken)
            });

            await dbContext.SaveChangesAsync();
        }

        public async Task ExtendSessionAsync(Guid sessionId, string refreshToken, DateTime expiresAt)
        {
            var session = await dbContext.Sessions.FindAsync(sessionId);
            session.ExpiresAt = expiresAt;
            session.LastRefreshToken = Converter.ToSHA256(refreshToken);

            await dbContext.SaveChangesAsync();
        }

        public async Task InvalidateSessionAsync(Guid sessionId)
        {
            var session = await dbContext.Sessions.FindAsync(sessionId);
            if (session is null) return;
            session.IsRevoked = true;

            await dbContext.SaveChangesAsync();
        }

        public async Task<bool> IsSessionValidAsync(Guid sessionId, string refreshToken)
        {
            var session = await dbContext.Sessions.FindAsync(sessionId);
            return session is not null && session.ExpiresAt > DateTimeOffset.UtcNow && !session.IsRevoked &&
                session.LastRefreshToken == Converter.ToSHA256(refreshToken);
        }
    }
}
