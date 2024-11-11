using System.Security.Cryptography;
using System.Text;

namespace Plogger.Server.Helpers
{
    public static class Converter
    {
        public static string ToSHA256(string toHash)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(toHash);
            var hashBytes = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hashBytes);
        }
    }
}
