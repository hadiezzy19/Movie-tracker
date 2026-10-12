namespace MovieTrackerAPI.Models
{
    public class Review
    {
        public int Id { get; set; }
        public int MovieId { get; set; }
        public int Rating { get; set; }
        public string ReviewText { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string MovieTitle { get; set; } = string.Empty;
        public string? MovieImage { get; set; }

        public int UserId { get; set; }
    }
}