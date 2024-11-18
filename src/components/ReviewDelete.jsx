function DeleteReview({ review, onDelete }) {
  const handleDelete = () => {
    onDelete(review.id);
  };

  return (
    <div>
      <h2>Delete Review</h2>
      <p>Are you sure you want to delete {review.movieTitle}?</p>
      <button onClick={handleDelete}>Yes, Delete</button>
      <button onClick={() => onDelete(null)}>Cancel</button>
    </div>
  );
}

export default DeleteReview;
