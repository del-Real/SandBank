using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using SandBank.Models;

namespace SandBank.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;

    // Dependency Injection
    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(User user)
    {
        // Read JWT settings
        var jwtSettings = _configuration.GetSection("Jwt");
        var secretKey = jwtSettings["SecretKey"]!;
        var issuer = jwtSettings["Issuer"]!;
        var audience = jwtSettings["Audience"]!;
        var expirationMinutes = int.Parse(jwtSettings["ExpirationMinutes"]!);

        // Secret string -> cryptographic key
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

        // Signing algorithm
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // Build Payload
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),         // user id
            new Claim(JwtRegisteredClaimNames.Email, user.Email),               // email
            new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),       // username
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())   // unique token id
        };

        // Build token (header + payload + signature)
        var token = new JwtSecurityToken(
            issuer: issuer,                                         // who created it
            audience: audience,                                     // who it's for
            claims: claims,                                         // payload data
            expires: DateTime.UtcNow.AddMinutes(expirationMinutes), // expiration
            signingCredentials: credentials                         // signs it with our key
        );

        // Serialize the token
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}