import { useState } from "react";
import StarRating from "./StarRating";

function EditReview({ review, onUpdate }) {
  const [rating, setRating] = useState(review.rating);
  const [content, setContent] = useState(review.content);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedReview = {
      ...review,
      rating,
      content,
    };
    onUpdate(updatedReview);
  };

  return (
    <div>
      <h2>Edit Review for {review.movieTitle}</h2>
      <form onSubmit={handleSubmit}>
         <div>
          <label>Rating:</label>
          <StarRating rating={rating} setRating={setRating} />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button className="button" type="submit">Update Review</button>
      </form>
    </div>
  );
}

export default EditReview;
