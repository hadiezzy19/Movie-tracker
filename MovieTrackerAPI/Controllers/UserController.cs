using Microsoft.AspNetCore.Mvc;
using MovieTrackerAPI.Models;

using MovieTrackerAPI.Data;

using Microsoft.EntityFrameworkCore;
namespace MovieTrackerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
         private readonly AppDbContext _context;

         public UserController(AppDbContext context)
        {
            _context = context;
        }
       
        [HttpPost("register")]
        public IActionResult Register(User user)
        {
            var emailExists = _context.User.Any(u => u.Email == user.Email);
            if (emailExists) return BadRequest("An account with this email already exists.");

            _context.User.Add(user);
            _context.SaveChanges();

            return Ok(new { user.Id, user.Username, });
        }

         [HttpPost("login")]
        public IActionResult Login(User user)
        {
            var existingUser = _context.User.FirstOrDefault(x =>
                x.Email == user.Email &&
                x.PasswordHash == user.PasswordHash
            );

            if (existingUser == null)
            {
                return BadRequest("Invalid Email or Password");
            }

            return Ok(new { existingUser.Id, existingUser.Username, existingUser.Email, });
        }

    }
}
