namespace MovieTrackerAPI.Models
{
    public class Movie
    {
        public int Id { get; set; }
        
        public string Title { get; set; } = string.Empty;
        
        // The '?' makes this optional (nullable)
        public string? ImageUrl { get; set; } 
        
        public int Rating { get; set; }
        
        public bool IsFavorite { get; set; } = false;

        public int UserId { get; set; }
    }
}