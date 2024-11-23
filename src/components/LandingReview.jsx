import { useEffect, useState } from "react";
import "../css/LandingPage.css";
import StarRating from "./StarRating";

// Fisher-Yates shuffle function
function shuffle(movies) {
  let m = movies.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = movies[m];
    movies[m] = movies[i];
    movies[i] = t;
  }

  return movies;
}

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

        // fetch all movie details
        const movieResponse = await fetch(
          `http://localhost:8083/movies`
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

        // Randomize the reviews using Fisher-Yates shuffle and limit to 25
        const shuffledReviews = shuffle(reviewsWithMovies).slice(0, 25);
        setReviews(shuffledReviews);
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
                <p className="landing-review-movie-title">{review.movieTitle}</p>
                <StarRating rating={review.rating} setRating={() => {}} />
                <p className="landing-review-username">{review.username}</p>
                <p className="landing-review-content-landing">{review.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingReview;
