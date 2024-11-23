import { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import ReviewCard from "./ReviewCard";

function ReviewList(props) {
  const { userReviews, fetchReviewsWithMovieTitlesByUserId } = props;
  const { currentUser } = useUserContext();
  const [error, setError] = useState(null);

  // call the fetchUserReviewsWithMovieDetails function inside the useEffect
  useEffect(() => {
    fetchReviewsWithMovieTitlesByUserId();
  }, [currentUser.userId]);

  // edit user Review
  const updateUserReview = async (updatedReview) => {
    try {
      console.log("ReviewDashboard.jsx - updating review:", updatedReview);

      // API call to update the review in the backend
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

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const updatedReviewFromApi = await response.json();
      console.log("Updated review from API:", updatedReviewFromApi);

      // after updating the review, re-fetch the reviews and movie details
      fetchReviewsWithMovieTitlesByUserId();
    } catch (error) {
      console.error("There was a problem with the update operation:", error);
      setError("Failed to update the review. Please try again.");
    }
  };

  // delete user review
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
          // after deleting the review, re-fetch the reviews and movie details
          fetchReviewsWithMovieTitlesByUserId();
        })
        .catch((error) => {
          console.error(
            "There was a problem with the delete operation:",
            error
          );
        });
    }
  };

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
              title={review.movieTitle}
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
