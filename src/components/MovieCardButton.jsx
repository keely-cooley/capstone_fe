import "../css/MovieList.css";

//add movie to watchlist
const MovieCardButton = (props) => {
  const { movie, buttonText, handleButtonClick } = props
  return (
    <button className="add-my-list" onClick = {() => handleButtonClick(movie)}>
      {" "}
      {/* Use a button element */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        className="bi bi-plus-lg"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
        />
      </svg>
      <span className="mr-2">{ buttonText }</span>
    </button>
  );
};

export default MovieCardButton;
