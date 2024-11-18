import { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";

function ReviewList(props) {
  const { userReviews, setUserReviews } = props;
  const [loading, setLoading] = useState(true);

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

        //fetch movie details for each review
        const movieDetails = reviews.map((review) =>
          fetch(`http://localhost:8083/movies/${review.movieId}`)
            .then((res) => res.json())
            .then((movie) => ({
              ...review,
              movieTitle: movie.title,
            }))
        );

        // wait for all movie details to be fetched
        Promise.all(movieDetails)
          .then((reviewsWithMovies) => {
            setUserReviews(reviewsWithMovies);
            setLoading(false);
          })
          .catch((error) => {
            console.error(
              "There was a problem with fetching movie details:",
              error
            );
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setLoading(false);
      });
  }, [setUserReviews]);

  //edit user Review
  const updateUserReview = (updatedReview) => {
    console.log("ReviewDashboard.jsx - updatedReview:", updatedReview);

    fetch(`http://localhost:8083/reviews/update/${updatedReview.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedReview),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((updatedReviewFromApi) => {
        setUserReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === updatedReview.id ? updatedReviewFromApi : review
          )
        );
      })
      .catch((error) => {
        console.error("There was a problem with the update operation:", error);
      });
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

  if (loading) {
    return <div>Loading Reviews...</div>;
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
