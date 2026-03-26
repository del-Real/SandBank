using SandBank.Models;

namespace SandBank.Services;

public interface ITokenService
{
    string GenerateToken(User user);
}