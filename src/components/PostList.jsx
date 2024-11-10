import { useEffect } from "react";
import UserPost from "./UserPost";

function PostList(props) {
  const { userPosts, setUserPosts } = props;

  //display user posts
  useEffect(() => {
    fetch("http://localhost:8083/userPosts")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((json) => {
        console.log("App.jsx useEffect", json);
        setUserPosts(json.result);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  //edit user Post
  const updateUserPost = (updatedPost) => {
    fetch(`http://localhost:8083/userPosts/update/${updatedPost.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPost),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((json) => {
        setUserPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === updatedPost.id ? json : post))
        );
      })
      .catch((error) => {
        console.error("There was a problem with the update operation:", error);
      });
  };

  //delete user post
  const deleteUserPost = (postId) => {
    if (postId) {
      fetch(`http://localhost:8083/userPosts/delete/${postId}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then(() => {
          setUserPosts((prevPosts) =>
            prevPosts.filter((post) => post.id !== postId)
          );
        })
        .catch((error) => {
          console.error(
            "There was a problem with the delete operation:",
            error
          );
        });
    }
  };

  return (
    <>
      <div className="user-post-container>">
        {userPosts.map((post) => (
          <UserPost
            id={post.id}
            movieTitle={post.movieTitle}
            rating={post.rating}
            content={post.content}
            key={post.id}
            onUpdate={updateUserPost}
            onDelete={deleteUserPost}
          />
        ))}
      </div>
    </>
  );
}

export default PostList;
