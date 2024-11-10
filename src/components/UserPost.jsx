import { useState } from "react";
import StarRating from "./StarRating";
import EditPost from "./EditPost";
import DeletePost from "./DeletePost";

import "../css/DashboardPage.css";

function UserPost(props) {
  const { id, movieTitle, rating, content, onUpdate, onDelete } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  console.log("post.jsx", id, movieTitle, rating, content);

  const handleUpdate = (updatedPost) => {
    onUpdate(updatedPost);
    setIsEditing(false);
  };

  const handleDelete = (postId) => {
    if (postId !== null) {
      onDelete(postId);
    }
    setIsDeleting(false);
  };

  return (
    <>
      <div className="user-post">
        <h3 className="review-movie-title">{movieTitle}</h3>
        <span>
          <StarRating rating={parseInt(rating, 10)} readOnly={true} />
        </span>
        <p className="review-content">{content}</p>
        <button onClick={() => setIsEditing(true)}>Edit</button>
        <button onClick={() => setIsDeleting(true)}>Delete</button>

        {isEditing && (
          <EditPost
            post={{ id, movieTitle, rating, content }}
            onUpdate={handleUpdate}
          />
        )}

        {isDeleting && (
          <DeletePost post={{ id, movieTitle }} onDelete={handleDelete} />
        )}
      </div>
    </>
  );
}

export default UserPost;
