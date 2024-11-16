import "../css/MovieList.css";
import MovieCardButton from "./MovieCardButton";

const MovieCard = (props) => {
  const { movie, addMovieToList, addMovieToSeen } = props;

  return (
    <>
      <div className=" image-container">
        <img
          src={movie.Poster}
          alt={movie.title}
          className="movie-poster"
        ></img>
        <div className="overlay d-flex align-items-center justify-content-center">
          <MovieCardButton
            buttonText="Add To My List"
            handleButtonClick={addMovieToList}
            movie={movie}
          />
          <MovieCardButton
            buttonText="Add To Seen List"
            handleButtonClick={addMovieToSeen}
            movie={movie}
          />
        </div>
      </div>
    </>
  );
};

export default MovieCard;
