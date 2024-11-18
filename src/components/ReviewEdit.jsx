import { useState } from "react";

function EditReview({ review, onUpdate }) {
  const [movieTitle, setMovieTitle] = useState(review.movieTitle);
  const [rating, setRating] = useState(review.rating);
  const [content, setContent] = useState(review.content);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedReview = {
      ...review,
      movieTitle,
      rating,
      content,
    };
    onUpdate(updatedReview);
  };

  return (
    <div>
      <h2>Edit Review</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Movie Title:</label>
          <input
            type="text"
            value={movieTitle}
            onChange={(e) => setMovieTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Rating:</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
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
