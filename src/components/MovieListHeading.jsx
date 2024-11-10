import "../css/MovieList.css";

const MovieListHeading = (props) => {
  return (
    <div className="col movie-list-heading">
      <h1>{props.heading}</h1>
    </div>
  );
};

export default MovieListHeading;
