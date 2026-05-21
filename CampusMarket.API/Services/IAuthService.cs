using CampusMarket.API.DTOs;

namespace CampusMarket.API.Services
{
    public interface IAuthService
    {
        string Register(RegisterDto dto);
        string Login(LoginDto dto);
    }
}
