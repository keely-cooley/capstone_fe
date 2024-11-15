import { useState } from "react";
import StarRating from "./StarRating";

function PostForm({ setUserPosts }) {
  const [movieTitle, setMovieTitle] = useState("");
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8083/userPosts/newPost", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movieTitle, rating, content }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        //fetch userPosts after successful POST call
        fetch("http://localhost:8083/userPosts")
          .then((res) => res.json())
          .then((json) => {
            console.log("App.jsx useEffect:", json.result);
            setUserPosts(json.result);
          });
      })
      .catch((error) => console.error("Error adding new post:", error));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* {movie title} */}
        <div>
          <label>
            {" "}
            Title:
            <input
              type="text"
              value={movieTitle}
              name="movieTitle"
              onChange={(e) => setMovieTitle(e.target.value)}
            />
          </label>
        </div>

        {/* {movie rating} */}
        <div>
          <StarRating rating={rating} setRating={setRating} />
        </div>

        {/* {movie rating content} */}
        <div>
          <label>
            {" "}
            Review:
            <input
              type="text"
              value={content}
              name="content"
              onChange={(e) => setContent(e.target.value)}
            />
          </label>
        </div>
        <button className="button">Add Review</button>
      </form>
    </div>
  );
}

export default PostForm;
