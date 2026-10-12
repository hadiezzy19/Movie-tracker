using Microsoft.AspNetCore.Mvc;
using MovieTrackerAPI.Models;
using MovieTrackerAPI.Data;
using MovieTrackerAPI.Helpers;

namespace MovieTrackerAPI.Controllers
{
    [ApiController]
    [Route("api/review")]
    public class ReviewController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReviewController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var userId = UserContext.GetUserId(Request);
            if (userId == null)
            {
                return Unauthorized(new { success = false, message = "User not authenticated" });
            }

            var reviews = _context.Reviews
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.Id)
                .ToList();

            return Ok(new { success = true, data = reviews });
        }

        [HttpPost]
        public IActionResult Create(Review review)
        {
            var userId = UserContext.GetUserId(Request);
            if (userId == null)
            {
                return Unauthorized(new { success = false, message = "User not authenticated" });
            }

            var movie = _context.Movies.Find(review.MovieId);
            if (movie == null || movie.UserId != userId)
            {
                return NotFound(new { success = false, message = "Movie not found" });
            }

            var user = _context.User.Find(userId);
            review.UserId = userId.Value;
            review.Username = user?.Username ?? "Unknown";
            review.MovieTitle = movie.Title;
            review.MovieImage = movie.ImageUrl;

            _context.Reviews.Add(review);
            _context.SaveChanges();
            return Ok(new { success = true, data = review });
        }
    }
}
