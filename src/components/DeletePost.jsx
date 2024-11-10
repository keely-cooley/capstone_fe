function DeletePost({ post, onDelete }) {
  const handleDelete = () => {
    onDelete(post.id);
  };

  return (
    <div>
      <h2>Delete Post</h2>
      <p>Are you sure you want to delete {post.movieTitle}?</p>
      <button onClick={handleDelete}>Yes, Delete</button>
      <button onClick={() => onDelete(null)}>Cancel</button>
    </div>
  );
}

export default DeletePost;
