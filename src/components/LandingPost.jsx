import { useEffect, useState } from "react";
import "../css/LandingPage.css";

const LandingReview = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("http://localhost:8083/reviews");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data.result);
        setReviews(data.result);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="recent-reviews">
      <div className="box-of-reviews">
        <p className="review-header">Recent Reviews</p>
        <div className="review-slot" id="review-slot">
          {reviews.map((review) => (
            <div className="review-card" key={review.id}>
              {/* <img src={review.image} className="review-img" alt="Review" /> */}
              <div className="review-body">
                <p className="review-username">{review.userId}</p>
                <p className="review-rating">{review.rating}</p>
                <p className="review-content-landing">{review.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingReview;
