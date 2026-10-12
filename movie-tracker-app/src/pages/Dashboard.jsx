import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { movieService } from "../services/movieService";
import { reviewService } from "../services/reviewService";

function Dashboard() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [movies, setMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ totalMovies: 0, averageRating: 0 });

  const [movieTitle, setMovieTitle] = useState("");
  const [movieImageUrl, setMovieImageUrl] = useState("");
  const [movieRating, setMovieRating] = useState("3");
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [reviewRating, setReviewRating] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      const [moviesResult, reviewsResult, statsResult] = await Promise.all([
        movieService.getAll(),
        reviewService.getAll(),
        movieService.getStats(),
      ]);

      if (moviesResult.success) setMovies(moviesResult.data);
      if (reviewsResult.success) setReviews(reviewsResult.data);
      if (statsResult.success) setStats(statsResult.data);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authService.isLoggedIn()) {
      navigate("/");
      return;
    }
    const user = authService.getUser();
    if (user) setUsername(user.username);
    loadDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    setAddError("");
    if (!movieTitle.trim()) return;

    setAddLoading(true);
    try {
      const result = await movieService.create({
        title: movieTitle.trim(),
        imageUrl: movieImageUrl.trim() || null,
        rating: Number(movieRating),
      });

      if (result.success) {
        setMovies((prev) => [result.data, ...prev]);
        setStats((prev) => ({
          totalMovies: prev.totalMovies + 1,
          averageRating:
            prev.totalMovies === 0
              ? result.data.rating
              : Number(
                  (
                    (prev.averageRating * prev.totalMovies + result.data.rating) /
                    (prev.totalMovies + 1)
                  ).toFixed(1)
                ),
        }));
        setMovieTitle("");
        setMovieImageUrl("");
        setMovieRating("3");
      } else {
        setAddError(result.message || "Could not add movie.");
      }
    } catch (error) {
      setAddError(error.response?.data?.message || error.response?.data || "Could not add movie.");
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await movieService.delete(id);
      if (result.success) {
        setMovies((prev) => prev.filter((m) => m.id !== id));
        setReviews((prev) => prev.filter((r) => r.movieId !== id));
        if (Number(selectedMovieId) === id) setSelectedMovieId("");
        const statsResult = await movieService.getStats();
        if (statsResult.success) setStats(statsResult.data);
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  const handleFavorite = async (id, currentFavorite) => {
    try {
      const result = await movieService.update(id, { isFavorite: !currentFavorite });
      if (result.success) {
        setMovies((prev) => prev.map((m) => (m.id === id ? result.data : m)));
      }
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    setReviewError("");
    if (!selectedMovieId || !reviewRating || !reviewText.trim()) return;

    setReviewLoading(true);
    try {
      const result = await reviewService.create({
        movieId: Number(selectedMovieId),
        rating: Number(reviewRating),
        reviewText: reviewText.trim(),
      });

      if (result.success) {
        setReviews((prev) => [result.data, ...prev]);
        setSelectedMovieId("");
        setReviewRating("");
        setReviewText("");
      } else {
        setReviewError(result.message || "Could not add review.");
      }
    } catch (error) {
      setReviewError(error.response?.data?.message || error.response?.data || "Could not add review.");
    } finally {
      setReviewLoading(false);
    }
  };

  const starDisplay = (n) => "★".repeat(n) + "☆".repeat(5 - n);

  if (loading) {
    return (
      <div className="dash-loading">
        <div className="spinner-border text-info" role="status" />
        <p className="mt-3">Loading your collection...</p>
      </div>
    );
  }

  return (
    <div className="dash-page">
      {/* ── HEADER ── */}
      <header className="dash-header">
        <div className="dash-header-inner">
          <div className="dash-brand">🎬 MovieTracker</div>
          <div className="dash-user">
            <span className="dash-username">👤 {username}</span>
            <button className="btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dash-content">
        {/* ── STATS ── */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="stat-card">
              <div className="stat-icon">🎥</div>
              <div className="stat-number">{stats.totalMovies}</div>
              <div className="stat-label">Movies Watched</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-number">{Number(stats.averageRating).toFixed(1)}</div>
              <div className="stat-label">Avg Rating</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-card">
              <div className="stat-icon">❤️</div>
              <div className="stat-number">{movies.filter((m) => m.isFavorite).length}</div>
              <div className="stat-label">Favourites</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-number">{reviews.length}</div>
              <div className="stat-label">Reviews</div>
            </div>
          </div>
        </div>

        {/* ── ADD MOVIE ── */}
        <div className="panel mb-4">
          <h5 className="panel-title">Add a Movie</h5>
          <form onSubmit={handleAddMovie}>
            <div className="row g-3">
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control custom-input"
                  placeholder="Movie title *"
                  value={movieTitle}
                  onChange={(e) => setMovieTitle(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4">
                <input
                  type="url"
                  className="form-control custom-input"
                  placeholder="Poster URL (optional)"
                  value={movieImageUrl}
                  onChange={(e) => setMovieImageUrl(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <select
                  className="form-select custom-input"
                  value={movieRating}
                  onChange={(e) => setMovieRating(e.target.value)}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} Star{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-1 d-flex align-items-center">
                <button type="submit" className="btn custom-btn w-100" disabled={addLoading}>
                  {addLoading ? <span className="spinner-border spinner-border-sm" /> : "+"}
                </button>
              </div>
            </div>
            {addError && <div className="alert alert-danger mt-3 mb-0">{addError}</div>}
          </form>
        </div>

        {/* ── MOVIES GRID ── */}
        <div className="panel mb-4">
          <h5 className="panel-title">
            Watched Movies
            <span className="panel-count">{movies.length}</span>
          </h5>

          {movies.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎞️</div>
              <p>No movies yet — add your first one above!</p>
            </div>
          ) : (
            <div className="row g-3">
              {movies.map((movie) => (
                <div className="col-sm-6 col-md-4 col-lg-3" key={movie.id}>
                  <div className="movie-card">
                    <div className="movie-poster-wrap">
                      <img
                        src={movie.imageUrl || "https://placehold.co/300x450/1a1a2e/4cc9f0?text=No+Poster"}
                        alt={movie.title}
                        className="movie-poster"
                      />
                      {movie.isFavorite && <span className="fav-badge">❤</span>}
                    </div>
                    <div className="movie-info">
                      <p className="movie-title-text">{movie.title}</p>
                      <p className="movie-stars">{starDisplay(movie.rating)}</p>
                      <div className="d-flex gap-2 mt-2">
                        <button
                          className={`btn btn-sm fav-btn ${movie.isFavorite ? "fav-active" : ""}`}
                          onClick={() => handleFavorite(movie.id, movie.isFavorite)}
                          title={movie.isFavorite ? "Remove favourite" : "Add favourite"}
                        >
                          {movie.isFavorite ? "❤ Fav" : "🤍 Fav"}
                        </button>
                        <button
                          className="btn btn-sm del-btn"
                          onClick={() => handleDelete(movie.id)}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── WRITE REVIEW ── */}
        <div className="panel mb-4">
          <h5 className="panel-title">Write a Review</h5>
          <form onSubmit={handleAddReview}>
            <div className="row g-3">
              <div className="col-md-4">
                <select
                  className="form-select custom-input"
                  value={selectedMovieId}
                  onChange={(e) => setSelectedMovieId(e.target.value)}
                  required
                >
                  <option value="">Select a movie...</option>
                  {movies.map((movie) => (
                    <option key={movie.id} value={movie.id}>
                      {movie.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select custom-input"
                  value={reviewRating}
                  onChange={(e) => setReviewRating(e.target.value)}
                  required
                >
                  <option value="">Rating...</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} Star{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-5">
                <textarea
                  className="form-control custom-input"
                  placeholder="Share your thoughts on this movie..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows="1"
                  style={{ resize: "none" }}
                  required
                />
              </div>
              <div className="col-md-1 d-flex align-items-center">
                <button type="submit" className="btn custom-btn w-100" disabled={reviewLoading}>
                  {reviewLoading ? <span className="spinner-border spinner-border-sm" /> : "Post"}
                </button>
              </div>
            </div>
            {reviewError && <div className="alert alert-danger mt-3 mb-0">{reviewError}</div>}
          </form>
        </div>

        {/* ── REVIEWS LIST ── */}
        <div className="panel">
          <h5 className="panel-title">
            Movie Reviews
            <span className="panel-count">{reviews.length}</span>
          </h5>

          {reviews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p>No reviews yet — be the first to write one!</p>
            </div>
          ) : (
            <div className="row g-3">
              {reviews.map((review) => (
                <div className="col-md-6" key={review.id}>
                  <div className="review-card">
                    <div className="review-poster-wrap">
                      <img
                        src={review.movieImage || "https://placehold.co/300x450/1a1a2e/4cc9f0?text=No+Poster"}
                        alt={review.movieTitle}
                        className="review-poster"
                      />
                    </div>
                    <div className="review-body">
                      <p className="review-movie-name">{review.movieTitle}</p>
                      <p className="review-by">by {review.username}</p>
                      <p className="review-stars-text">{starDisplay(review.rating)}</p>
                      <p className="review-content">{review.reviewText}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
