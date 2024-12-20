import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Fisher-Yates shuffle function
function shuffle(movies) {
  var m = movies.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = movies[m];
    movies[m] = movies[i];
    movies[i] = t;
  }

  return movies;
}

const LandingMovie = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:8083/movies");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        shuffle(data)
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const handleMovieClick = (movieId) => {
    console.log(movieId);
    //navigate to movie details
    navigate(`/movie/${movieId}`);
  };

  return (
    <div id="scrolling-movie-list-container">
      <div id="scrolling-movie-list">
        {movies.map((movie) => (
          <div onClick={() => handleMovieClick(movie.id)} className="movie-card card m-2" key={movie.id}>
            <img className="card-img-top" src={movie.img} alt={movie.title} />
            <div className="card-body">
              <h5 className="card-title">{movie.title}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingMovie;
