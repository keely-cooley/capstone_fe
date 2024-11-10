import { useState } from "react";

function EditPost({ post, onUpdate }) {
  const [movieTitle, setMovieTitle] = useState(post.movieTitle);
  const [rating, setRating] = useState(post.rating);
  const [content, setContent] = useState(post.content);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedPost = {
      ...post,
      movieTitle,
      rating,
      content,
    };
    onUpdate(updatedPost);
  };

  return (
    <div>
      <h2>Edit Post</h2>
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
        <button type="submit">Update Post</button>
      </form>
    </div>
  );
}

export default EditPost;
