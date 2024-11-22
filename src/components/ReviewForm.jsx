import { useState, useEffect } from "react";
import StarRating from "./StarRating";
import { useUserContext } from "../context/UserContext";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

function ReviewForm({ setUserReviews }) {
  const { currentUser } = useUserContext();

  const [movieTitle, setMovieTitle] = useState("");
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [movieTitles, setMovieTitles] = useState([]);
  const [ movieId, setMovieId] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newReview = {
      rating: rating,
      content: content,
      userId: currentUser.userId,
      movieId: movieId,
    };

    //create new review
    fetch("http://localhost:8083/reviews/new", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReview),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log("Review created:", json);

        // fetch updated reviews after successful POST
        fetch(`http://localhost:8083/reviews/user/id/${currentUser.userId}`)
          .then((res) => res.json())
          .then((json) => {
            console.log("Updated reviews:", json);
            setUserReviews(json);
          })
          .catch((err) => console.error("Error fetching reviews:", err));
      })
      .catch((error) => {
        console.error("Error adding new review:", error);
      });
  };

  const fetchSeenList = async () => {
    try {
      const response = await fetch(
        `http://localhost:8083/seenMovies/user/${currentUser.userId}`
      );
      const data = await response.json();
      const titles = data.map((movie) => {
        return { id: movie.id, name: movie.title };
      });
      setMovieTitles(titles);
      console.log(titles);
    } catch (error) {
      console.log("DashboardPage.jsx.jsx : an error occurred", error);
    }
  };

  const handleOnSelect = (item) => {
    // the item selected
    setMovieId(item.id);
  };

  useEffect(() => {
    fetchSeenList();
  }, [currentUser.userId]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* {movie title} */}
        <div>
          <label>
            {" "}
            Find A Title In Your Seen List:
            <ReactSearchAutocomplete
              items={movieTitles}
              onSelect={handleOnSelect}
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

export default ReviewForm;
