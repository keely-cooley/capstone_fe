import MovieCard from "./MovieCard";

const MovieList = (props) => {
  // const MyListComponent = props.myListComponent;
  const { movies = [], addMovieToList, addMovieToSeen, removeMovie } = props;

  // checking movies is an array for map
  if (!Array.isArray(movies)) {
    console.error("MovieList: movie prop is not an array", movies);
    return <div className="movie-list-error">No movies to display.</div>;
  }

  return (
    <>
      <div className="movie-list">
        {props.movies.map((movie) => (
          <MovieCard
            movie={movie}
            key={movie.imdbID || movie.id} // in case imdbID does not exist
            addMovieToList={addMovieToList}
            addMovieToSeen={addMovieToSeen}
            removeMovie={removeMovie}
          />
        ))}
      </div>
    </>
  );
};
export default MovieList;
