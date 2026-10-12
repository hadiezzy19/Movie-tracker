using Microsoft.AspNetCore.Mvc;
using MovieTrackerAPI.Models;
using MovieTrackerAPI.Data;
using MovieTrackerAPI.Helpers;

namespace MovieTrackerAPI.Controllers
{
    [ApiController]
    [Route("api/watchedmovie")]
    public class MovieController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MovieController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetMovies()
        {
            var userId = UserContext.GetUserId(Request);
            if (userId == null)
            {
                return Unauthorized(new { success = false, message = "User not authenticated" });
            }

            var movies = _context.Movies
                .Where(m => m.UserId == userId)
                .OrderByDescending(m => m.Id)
                .ToList();

            return Ok(new { success = true, data = movies });
        }

        [HttpGet("stats")]
        public IActionResult GetStats()
        {
            var userId = UserContext.GetUserId(Request);
            if (userId == null)
            {
                return Unauthorized(new { success = false, message = "User not authenticated" });
            }

            var userMovies = _context.Movies.Where(m => m.UserId == userId);
            var totalMovies = userMovies.Count();
            var averageRating = totalMovies > 0 ? userMovies.Average(m => m.Rating) : 0;

            return Ok(new
            {
                success = true,
                data = new
                {
                    totalMovies,
                    averageRating
                }
            });
        }

        [HttpPost]
        public IActionResult CreateMovie(Movie movie)
        {
            var userId = UserContext.GetUserId(Request);
            if (userId == null)
            {
                return Unauthorized(new { success = false, message = "User not authenticated" });
            }

            movie.UserId = userId.Value;
            _context.Movies.Add(movie);
            _context.SaveChanges();

            return Ok(new { success = true, data = movie });
        }

        [HttpPut("{id}")]
        public IActionResult UpdateMovie(int id, Movie updateData)
        {
            var userId = UserContext.GetUserId(Request);
            if (userId == null)
            {
                return Unauthorized(new { success = false, message = "User not authenticated" });
            }

            var movie = _context.Movies.Find(id);
            if (movie == null || movie.UserId != userId)
            {
                return NotFound(new { success = false, message = "Movie not found" });
            }

            movie.IsFavorite = updateData.IsFavorite;
            _context.SaveChanges();

            return Ok(new { success = true, data = movie });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteMovie(int id)
        {
            var userId = UserContext.GetUserId(Request);
            if (userId == null)
            {
                return Unauthorized(new { success = false, message = "User not authenticated" });
            }

            var movie = _context.Movies.Find(id);
            if (movie == null || movie.UserId != userId)
            {
                return NotFound(new { success = false, message = "Movie not found" });
            }

            _context.Movies.Remove(movie);
            _context.SaveChanges();

            return Ok(new { success = true });
        }
    }
}
