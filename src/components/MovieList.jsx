import "../css/MovieList.css";

const MovieList = (props) => {
  const MyListComponent = props.myListComponent;
  return (
    <>
      <div className="movie-list">
        {props.movies.map((movie, index) => (
          <div className=" image-container" key={index}>
            <img
              src={movie.Poster}
              alt={movie.title}
              className="movie-poster"
            ></img>
            <div
              onClick={() => props.handleMyListCLick(movie)}
              className="overlay d-flex align-items-center justify-content-center"
            >
              <MyListComponent />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MovieList;
