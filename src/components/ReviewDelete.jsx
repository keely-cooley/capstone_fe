function DeleteReview({ review, onDelete }) {
  const handleDelete = () => {
    onDelete(review.id);
  };

  return (
    <div>
      <h2>Delete Review</h2>
      <p>Are you sure you want to delete your review for {review.movieTitle}?</p>
      <button className="button" onClick={handleDelete}>Delete!</button>
      <button className="button" onClick={() => onDelete(null)}>Cancel</button>
    </div>
  );
}

export default DeleteReview;
