import { useState } from "react";
import StarRating from "./StarRating";
import ReviewEdit from "./ReviewEdit";
import ReviewDelete from "./ReviewDelete";

import "../css/DashboardPage.css";

function UserReview(props) {
  const { id, title, rating, content, onUpdate, onDelete } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdate = (updatedReview) => {
    onUpdate(updatedReview);
    setIsEditing(false);
  };

  const handleDelete = (reviewId) => {
    if (reviewId !== null) {
      onDelete(reviewId);
    }
    setIsDeleting(false);
  };

  return (
    <>
      <div className="user-review">
        <h3 className="review-movie-title">{title}</h3>
        <span>
          <StarRating rating={parseInt(rating, 10)} readOnly={true} />
        </span>
        <p className="review-content">{content}</p>
        <button className="button" onClick={() => setIsEditing(true)}>
          Edit
        </button>
        <button className="button" onClick={() => setIsDeleting(true)}>
          Delete
        </button>

        {isEditing && (
          <ReviewEdit
            review={{ id, title, rating, content }}
            onUpdate={handleUpdate}
          />
        )}

        {isDeleting && (
          <ReviewDelete review={{ id, title }} onDelete={handleDelete} />
        )}
      </div>
    </>
  );
}

export default UserReview;
