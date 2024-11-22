import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../css/MovieDetails.css";
import StarRating from "./StarRating";

export default function MovieDetails() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState([]);
  const [error, setError] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // fetch movie details by ID when the component is mounted
    fetch(`http://localhost:8083/movies/${movieId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Movie not found");
        }
        return response.json();
      })
      .then((data) => {
        setMovie(data);
        console.log("MovieDetails.jsx - useEffect fetch movie by id:", data);
      })
      .catch((err) => {
        setError("Failed to fetch movie details");
        console.error(err);
      });
  }, [movieId]); // only re-run when movieId changes

  useEffect(() => {
    // fetch review by movie ID
    fetch(`http://localhost:8083/reviews/movie/id/${movieId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Reviews not found");
        }
        return response.json();
      })
      .then((data) => {
        setReviews(data);
        console.log(
          "MovieDetails.jsx - useEffect fetch reviews by movieId:",
          data
        );
      })
      .catch((err) => {
        setError("Failed to fetch movie reviews");
        console.error(err);
      });
  }, [movieId]); // only re-run when movieId changes

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {movie ? (
        <div className="movie-details-container">
          <div className="movie-details-box">
            <h2 className="movie-details-title">{movie.title}</h2>
            <div className="movie-details-header">
              <img
                src={movie.img}
                alt={movie.title}
                style={{ width: "150px", height: "auto", marginRight: "20px" }}
              />
              <div>
                <p>
                  <strong>Rating:</strong> {movie.rating || "Not Available"}
                </p>
              </div>
            </div>
            <div className="movie-details-body">
              <p>
                <strong>Genre:</strong> {movie.genre}
              </p>
              <p>
                <strong>Director:</strong> {movie.director}
              </p>
              <p>
                <strong>Runtime:</strong> {movie.runtime}
              </p>
            </div>
          </div>
          <div className="recent-reviews">
            <div className="box-of-reviews">
              <p className="landing-review-header">Recent Reviews</p>
              <div className="landing-review-slot" id="review-slot">
                {reviews.map((review) => (
                  <div className="landing-review-card" key={review.id}>
                    <div className="landing-review-body">
                      <p className="landing-review-movie-title">
                        {review.movieTitle}
                      </p>
                      <StarRating rating={review.rating} setRating={() => {}} />
                      <p className="landing-review-username">
                        {review.username}
                      </p>
                      <p className="landing-review-content-landing">
                        {review.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
