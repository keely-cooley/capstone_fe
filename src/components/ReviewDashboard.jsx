import { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";

function ReviewList(props) {
  const { userReviews, setUserReviews } = props;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch user reviews and movie details
  useEffect(() => {
    // first fetch the reviews
    fetch("http://localhost:8083/reviews")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((reviews) => {
        console.log("Dashboard.jsx - fetched reviews for display", reviews);

        // extract all unique movieIds from the reviews
        const movieIds = [...new Set(reviews.map((review) => review.movieId))];

        // fetch all movie details
        fetch(`http://localhost:8083/movies?ids=${movieIds.join(",")}`)
          .then((res) => {
            if (!res.ok) {
              throw new Error("Network response was not ok");
            }
            return res.json();
          })
          .then((movies) => {
            const movieMap = movies.reduce((acc, movie) => {
              acc[movie.id] = movie.title;
              return acc;
            }, {});

            // add movie titles to reviews based on movieId
            const reviewsWithMovies = reviews.map((review) => ({
              ...review,
              movieTitle: movieMap[review.movieId] || "Unknown Movie",
            }));

            setUserReviews(reviewsWithMovies);
            setLoading(false);
          })
          .catch((error) => {
            console.error(
              "There was a problem with fetching movie details:",
              error
            );
            setError("Failed to load movie details. Please try again later.");
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setError("Failed to load reviews. Please try again later.");
        setLoading(false);
      });
  }, [setUserReviews]);

  // edit user Review
  const updateUserReview = async (updatedReview) => {
    try {
      console.log("ReviewDashboard.jsx - updating review:", updatedReview);

      // Make the API call to update the review in the backend
      const response = await fetch(
        `http://localhost:8083/reviews/update/${updatedReview.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedReview),
        }
      );

      // Check if the response is OK, otherwise throw an error
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Parse the response JSON data
      const updatedReviewFromApi = await response.json();

      console.log("Updated review from API:", updatedReviewFromApi);

      // Update the user reviews with the modified review
      setUserReviews((prevReviews) => {
        const updatedReviews = prevReviews.map((review) =>
          review.id === updatedReview.id ? updatedReviewFromApi : review
        );

        // Debugging: Check if the updated review is in the list
        console.log("Updated reviews array:", updatedReviews);
        return updatedReviews;
      });
    } catch (error) {
      console.error("There was a problem with the update operation:", error);
      setError("Failed to update the review. Please try again.");
    }
  };

  //delete user review
  const deleteUserReview = (reviewId) => {
    if (reviewId) {
      fetch(`http://localhost:8083/reviews/delete/${reviewId}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then(() => {
          setUserReviews((prevReviews) =>
            prevReviews.filter((review) => review.id !== reviewId)
          );
        })
        .catch((error) => {
          console.error(
            "There was a problem with the delete operation:",
            error
          );
        });
    }
  };

  // display loading state or error message
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userReviews.length) {
    return <div>No reviews found.</div>;
  }

  return (
    <>
      <div className="user-review-container">
        {userReviews && userReviews.length > 0 ? (
          userReviews.map((review) => (
            <ReviewCard
              key={review.id}
              id={review.id}
              rating={review.rating}
              content={review.content}
              movieTitle={review.movieTitle}
              onUpdate={updateUserReview}
              onDelete={deleteUserReview}
            />
          ))
        ) : (
          <div>No reviews found.</div>
        )}
      </div>
    </>
  );
}

export default ReviewList;
