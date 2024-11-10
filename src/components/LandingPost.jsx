import { useEffect, useState } from "react";
import "../css/LandingPage.css";

const LandingPost = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:8083/landingPost");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data.result);
        setPosts(data.result);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="recent-reviews">
      <div className="box-of-reviews">
        <p className="review-header">Recent Reviews</p>
        <div className="review-slot" id="review-slot">
          {posts.map((post) => (
            <div className="review-card" key={post.id}>
              <img src={post.image} className="review-img" alt="Review" />
              <div className="review-body">
                <p className="review-username">{post.username}</p>
                <p className="review-rating">{post.rating}</p>
                <p className="review-content-landing">{post.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPost;
