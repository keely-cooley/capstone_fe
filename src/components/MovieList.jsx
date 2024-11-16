import "../css/MovieList.css";
import MovieCard from "./MovieCard";

const MovieList = (props) => {
  // const MyListComponent = props.myListComponent;
  const { addMovieToList, addMovieToSeen, removeMovie } = props;
  return (
    <>
      <div className="movie-list">
        {props.movies.map((movie) => (
          <MovieCard
            movie={movie}
            key={movie.id}
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
