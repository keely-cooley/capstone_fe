import MovieCardButton from "./MovieCardButton";

const MovieCard = (props) => {
  const { movie, addMovieToList, addMovieToSeen, removeMovie } = props;

  return (
    <>
      <div className=" image-container">
        <img
          src={movie.img}
          alt={movie.title}
          className="movie-poster"
        ></img>
        <div className="overlay d-flex align-items-center justify-content-center">
          {addMovieToList && (
            <MovieCardButton
              buttonText="Add To My List"
              handleButtonClick={addMovieToList}
              movie={movie}
            />
          )}
          {addMovieToSeen && (
            <MovieCardButton
              buttonText="Add To Seen List"
              handleButtonClick={addMovieToSeen}
              movie={movie}
            />
          )}
          {removeMovie && (
            <MovieCardButton
              buttonText="Remove"
              handleButtonClick={removeMovie}
              movie={movie}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default MovieCard;
