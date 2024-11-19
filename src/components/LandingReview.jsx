import { useEffect, useState } from "react";
import "../css/LandingPage.css";

const LandingReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviewsAndMovies = async () => {
      try {
        // first fetch the reviews
        const reviewResponse = await fetch("http://localhost:8083/reviews");
        if (!reviewResponse.ok) {
          throw new Error("Network response for reviews was not ok");
        }
        const reviewsData = await reviewResponse.json();
        console.log("Fetched reviews:", reviewsData);

        // extract unique movieIds from reviews
        const movieIds = [
          ...new Set(reviewsData.map((review) => review.movieId)),
        ];

        // fetch all movie details
        const movieResponse = await fetch(
          `http://localhost:8083/movies?ids=${movieIds.join(",")}`
        );
        if (!movieResponse.ok) {
          throw new Error("Network response for movies was not ok");
        }
        const moviesData = await movieResponse.json();
        console.log("Fetched movies:", moviesData);

        // map movie titles by movie ID
        const movieMap = moviesData.reduce((acc, movie) => {
          acc[movie.id] = movie.title;
          return acc;
        }, {});

        // map reviews to include movie titles
        const reviewsWithMovies = reviewsData.map((review) => ({
          ...review,
          movieTitle: movieMap[review.movieId] || "Unknown Movie",
        }));

        setReviews(reviewsWithMovies);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews and movies:", error);
        setError("Failed to load reviews and movies. Please try again later.");
        setLoading(false);
      }
    };

    fetchReviewsAndMovies();
  }, []); //runs once when component mounts

  // loading state or error message
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!reviews.length) {
    return <div>No reviews found.</div>;
  }

  return (
    <div className="recent-reviews">
      <div className="box-of-reviews">
        <p className="landing-review-header">Recent Reviews</p>
        <div className="landing-review-slot" id="review-slot">
          {reviews.map((review) => (
            <div className="landing-review-card" key={review.id}>
              <div className="landing-review-body">
                <p className="landing-review-movie-title">
                  {review.movieTitle}
                </p>{" "}
                {/* Display movie title */}
                <p className="landing-review-username">{review.username}</p>
                <p className="landing-review-rating">{review.rating}</p>
                <p className="landing-review-content-landing">
                  {review.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingReview;
