import { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import ReviewCard from "./ReviewCard";

function ReviewList(props) {
  const { userReviews, setUserReviews } = props;
  const { currentUser } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch user reviews and associated movie details
  const fetchUserReviewsWithMovieDetails = () => {
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
        // console.log(currentUser)

        //filter reviews for only currentUser
        const filteredReviews = reviews.filter((review) => review.userId === currentUser.userId)
        console.log("first filtered reviews:", filteredReviews)
        // extract all unique movieIds from the reviews
        // const movieIds = [...new Set(reviews.map((review) => review.movieId))];

        // fetch all movie details
        fetch(`http://localhost:8083/movies`)
          .then((res) => {
            if (!res.ok) {
              throw new Error("Network response was not ok");
            }
            return res.json();
          })
          .then((movies) => {
            console.log("ReviewDashboard.jx - fetchUserReviewsWithMovieDetails - fetch all movies:", movies)
            const movieMap = movies.reduce((acc, movie) => {
              acc[movie.id] = movie.title;
              return acc;
            }, {});
            console.log("MovieMap:", movieMap)

            // add movie titles to reviews based on movieId
            // const reviewsWithMovies = filteredReviews.map((review) => ({
            //   ...review,
            //   movieTitle: movieMap[review.movieId] || "Unknown Movie",
            // }));

            const newMovieData = [];
            filteredReviews.map((review) => {
              let newReview = {
                ...review,
                title: movieMap[review.movieId] || "unknown movie",
              };
              newMovieData.push(newReview)
            });
            // use the parent function to set reviews
            setUserReviews(newMovieData);
            console.log("reviews with movie titles:", newMovieData);
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
  };

  // call the fetchUserReviewsWithMovieDetails function inside the useEffect
  useEffect(() => {
    fetchUserReviewsWithMovieDetails();
  }, [setUserReviews]);

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
      fetchUserReviewsWithMovieDetails();
  
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
          fetchUserReviewsWithMovieDetails();
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
              title={review.title}
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