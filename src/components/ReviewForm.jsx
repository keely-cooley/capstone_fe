import { useState, useEffect } from "react";
import StarRating from "./StarRating";
import { useUserContext } from "../context/UserContext";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

function ReviewForm({ seenListUpdated, fetchReviewsWithMovieTitlesByUserId }) {
  const { currentUser } = useUserContext();

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [movieTitles, setMovieTitles] = useState([]);
  const [movieId, setMovieId] = useState(0);

  // Fetch seen movies asynchronously
  const fetchSeenList = async () => {
    try {
      const response = await fetch(
        `http://localhost:8083/seenMovies/user/${currentUser.userId}`
      );
      const data = await response.json();
      const titles = data.map((movie) => ({
        id: movie.id,
        name: movie.title,
      }));
      setMovieTitles(titles);
    } catch (error) {
      console.error("Error fetching seen list:", error);
    }
  };

  // UseEffect to fetch the seen list on load and when seenListUpdated changes
  useEffect(() => {
    const fetchData = async () => {
      await fetchSeenList(); // re-fetch seen list when seenListUpdated changes
    };
    fetchData();
  }, [seenListUpdated, currentUser.userId]);

  // Handle submit function asynchronously
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newReview = {
      rating: rating,
      content: content,
      userId: currentUser.userId,
      movieId: movieId,
    };

    try {
      // POST new review
      const response = await fetch("http://localhost:8083/reviews/new", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });

      const reviewData = await response.json();
      console.log("Review created:", reviewData);

      fetchReviewsWithMovieTitlesByUserId();
    } catch (error) {
      console.error("Error adding new review:", error);
    }
  };

  // Handle movie selection asynchronously
  const handleOnSelect = (item) => {
    setMovieId(item.id);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
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

        <div>
          <StarRating rating={rating} setRating={setRating} />
        </div>

        <div>
          <label>
            {" "}
            <input
              type="text"
              value={content}
              name="content"
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your review..."
            />
          </label>
        </div>
        <button className="button">Add Review</button>
      </form>
    </div>
  );
}

export default ReviewForm;
