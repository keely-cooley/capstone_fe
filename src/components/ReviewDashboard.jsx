import { useEffect } from "react";
import UserReview from "./UserReview";

function ReviewList(props) {
  const { userReviews, setUserReviews } = props;

  //display user reviews
  useEffect(() => {
    fetch("http://localhost:8083/reviews")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((json) => {
        console.log("App.jsx useEffect", json);
        setUserReviews(json.result);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  //edit user Review
  const updateUserReview = (updatedReview) => {
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
      .then((json) => {
        setUserReviews((prevReviews) =>
          prevReviews.map((review) => (review.id === updatedReview.id ? json : review))
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

  return (
    <>
      <div className="user-review-container>">
        {userReviews.map((review) => (
          <UserReview
            id={review.id}
            movieTitle={review.movieTitle}
            rating={review.rating}
            content={review.content}
            key={review.id}
            onUpdate={updateUserReview}
            onDelete={deleteUserReview}
          />
        ))}
      </div>
    </>
  );
}

export default ReviewList;
