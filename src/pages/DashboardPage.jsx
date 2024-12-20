import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useUserContext } from "../context/UserContext";
import MovieList from "../components/MovieList";
import MovieListHeading from "../components/MovieListHeading";
import SearchBox from "../components/SearchBox";
import ReviewForm from "../components/ReviewForm";
import ReviewDashboard from "../components/ReviewDashboard";
import "../css/DashboardPage.css";

function DashboardPage() {
  // check to see if the user is logged in
  const { currentUser } = useUserContext();

  // STATE variables
  const [movies, setMovies] = useState([]);
  const [myList, setMyList] = useState([]);
  const [seenList, setSeenList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [userReviews, setUserReviews] = useState([]);
  const [seenListUpdated, setSeenListUpdated] = useState(false);

  //search for movies
  const getMovieRequest = async (searchValue) => {
    // make request to API
    const url = `http://www.omdbapi.com/?s=${searchValue}&apikey=2aa94c15`;

    try {
      const response = await fetch(url);
      // convert response to JSON
      const responseJson = await response.json();
      console.log(responseJson);

      // UPDATING STATE - updates movies state when movie data is fetched successfully
      if (responseJson.Search) {
        console.log(responseJson);
        const convertedMovies = [];

        responseJson.Search.forEach(async (movie) => {
          //movie details not included in API initial search
          const details = {
            genre: "",
            director: "",
            runtime: "",
            rating: null,
          };

          convertedMovies.push({
            imdbID: movie.imdbID || "",
            title: movie.Title || "",
            year: movie.Year || "",
            genre: details.genre,
            director: details.director,
            runtime: details.runtime,
            rating: details.rating,
            img: movie.Poster || "",
          });
          //confirms array is the same length and all movies are converted before updating state
          if (convertedMovies.length === responseJson.Search.length) {
            console.log(convertedMovies);
            setMovies(convertedMovies);
          }
        });
      } else {
        console.log("No movies found.");
      }
    } catch (error) {
      console.log("Error fetching movies:", error);
    }
  };

  // ADD MOVIE 'TO MY LIST'
  const addMovieToList = async (movie) => {
    //check if movie already exists in 'my list'
    if (myList.some((check) => check.imdbID === movie.imdbID)) {
      console.log("Movie is already in your list");
      return; //?? what should I return here to display already in list to user
    }

    console.log("addMovieToList", currentUser.userId);

    try {
      //validate the movie
      const validationResponse = await fetch(
        `http://localhost:8083/movies/validate/${movie.imdbID}`
      );
      const validationJson = await validationResponse.json();
      console.log("ValidationJson:", validationJson);
      if (!validationJson.data.id) {
        console.log(validationJson.data.id);
        return;
      }
      if (validationResponse.ok) {
        //create new listed movie object
        const newListedMovie = {
          userId: currentUser.userId,
          movieId: validationJson.data.id,
        };
        try {
          //add movie to listedMovies table
          const addMovieResponse = await fetch(
            "http://localhost:8083/listedMovies",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newListedMovie),
            }
          );
          console.log(addMovieResponse);

          if (addMovieResponse.ok) {
            console.log("Movie successfully added to your list!");
            fetchMyList();
          } else {
            console.log("Failed to add movie to list");
          }
        } catch (error) {
          console.log(
            "addMovieToList: an error occurred while adding movie to you list",
            error
          );
        }
      } else {
        console.log("movie validation failed", validationResponse);
      }
    } catch (error) {
      console.log("setMyList - validate movie", error);
    }
  };

  // ADD MOVIE TO 'seen list' and remove from 'my list'
  const addMovieToSeen = async (movie) => {
    try {
      //check if movie already exists in 'seen list'
      if (seenList.some((check) => check.imdbID === movie.imdbID)) {
        console.log("Movie is already in seen list");
        return; //?? what should I return here to display already in list to user
      }
      // create new movie object
      const newSeenMovie = {
        userId: currentUser.userId,
        movieId: movie.id,
      };

      // add movie to seen list: POST request
      const addMovieResponse = await fetch("http://localhost:8083/seenMovies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSeenMovie),
      });

      if (addMovieResponse.ok) {
        console.log("Movie successfully added to your seen list!");
        await removeListMovie(movie);
        await fetchMyList();
        await fetchSeenList();
      } else {
        console.log("Failed to add movie to seen list");
      }
    } catch (error) {
      console.log("Error occurred while processing movie:", error);
    }
  };

  //REMOVE MOVIE FROM  'seen list'
  const removeSeenMovie = async (movie) => {
    //get movie id
    console.log("removeSeenMovie:", movie);
    const seenMovieToDelete = {
      userId: currentUser.userId,
      movieId: movie.id,
    };

    //remove movie from seen list
    try {
      console.log(seenMovieToDelete);
      const deleteSeenListResponse = await fetch(
        `http://localhost:8083/seenMovies/userIdAndMovieId`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(seenMovieToDelete),
        }
      );
      if (deleteSeenListResponse.ok) {
        console.log("Movie successfully removed from seen list!");
        await fetchSeenList();
      } else {
        console.log("Failed to remove movie from seen list");
        console.log("Delete movie error", deleteSeenListResponse);
      }
    } catch (error) {
      console.log("Error occurred while removing movie from seen list:", error);
    }
  };

  //REMOVE MOVIE FROM 'my list'
  const removeListMovie = async (movie) => {
    //get movie id
    console.log("removeListMovie:", movie);
    const listedMovieToDelete = {
      userId: currentUser.userId,
      movieId: movie.id,
    };

    //remove movie from list
    try {
      console.log(listedMovieToDelete);
      const deleteMyListResponse = await fetch(
        `http://localhost:8083/listedMovies/userIdAndMovieId`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(listedMovieToDelete),
        }
      );
      if (deleteMyListResponse.ok) {
        console.log("Movie successfully removed from your list!");
        await fetchMyList();
      } else {
        console.log("Failed to remove movie from my list");
        console.log("Delete movie error", deleteMyListResponse);
      }
    } catch (error) {
      console.log("Error occurred while removing movie from your list:", error);
    }
  };

  // useEffect to fetch movies based on searchValue
  useEffect(() => {
    if (searchValue) {
      getMovieRequest(searchValue);
    }
  }, [searchValue]);

  const fetchMyList = async () => {
    try {
      const response = await fetch(
        `http://localhost:8083/listedMovies/user/${currentUser.userId}`
      );
      const data = await response.json();
      console.log("Updating My List");
      setMyList(data);
    } catch (error) {
      console.log("DashboardPage.jsx.jsx : an error occurred", error);
    }
  };

  const fetchSeenList = async () => {
    try {
      const response = await fetch(
        `http://localhost:8083/seenMovies/user/${currentUser.userId}`
      );
      const data = await response.json();
      setSeenList(data);
    } catch (error) {
      console.log("DashboardPage.jsx.jsx : an error occurred", error);
    }
  };

  const fetchReviewsWithMovieTitlesByUserId = async () => {
    console.log("FETCHREVIEWSWITHMOVIETITLESBYUSERID");
    try {
      const response = await fetch(
        `http://localhost:8083/reviews/userwithreviewsandmovietitles/id/${currentUser.userId}`
      );
      const validResponseJson = await response.json();
      await setUserReviews(validResponseJson);
    } catch (error) {
      console.log("fetchReviewsWithMovieTitleByUserId: error", error);
    }
  };

  //re-fetch when a movie is added to seen list
  const handleSeenListUpdate = () => {
    setSeenListUpdated((prev) => !prev);
  };

  //any time the page loads, load 'my list' from database
  useEffect(() => {
    fetchMyList();
  }, [currentUser.userId]);

  //any time the page loads or setSenListUpdated changes, load 'seen list' from database
  useEffect(() => {
    fetchSeenList();
  }, [seenListUpdated, currentUser.userId]);

  return (
    <>
      {/* All movies */}
      <div className="container-fluid movie-app">
        <div className="landing-search-row d-flex align-items-center mt-4 mb-4">
          <div className="landing-search-col text-center">
            <MovieListHeading heading="Find A Film" />
          </div>
          <div className="col">
            <SearchBox
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />
          </div>
        </div>
        <div className="row">
          <MovieList
            movies={movies}
            addMovieToList={addMovieToList}
            addMovieToSeen={null}
            removeMovie={null}
          />
        </div>

        {/* Movies in user's 'My List' */}
        <div className="row d-flex align-items-center mt-4 mb-4">
          <div className="col text-center">
            <MovieListHeading heading="Your Watch List" />
          </div>
        </div>
        <div className="row">
          <MovieList
            movies={myList}
            addMovieToList={null}
            addMovieToSeen={addMovieToSeen}
            removeMovie={removeListMovie}
          />
        </div>

        {/* Movies in user's 'Seen List' */}
        <div className="row d-flex align-items-center mt-4 mb-4">
          <div className="col text-center">
            <MovieListHeading heading="Your Seen List" />
          </div>
        </div>
        <div className="row">
          <MovieList
            movies={seenList}
            addMovieToList={null}
            addMovieToSeen={null}
            removeMovie={removeSeenMovie}
          />
        </div>
      </div>
      {/* User's Reviews */}
      <div className="dashboard-review-container">
        <div className="dashboard-box-of-reviews">
          <h2 className="dashboard-review-header">Your Reviews</h2>

          <div className="dashboard-review-row">
            <div className="dashboard-review-col-md-6">
              <div className="dashboard-review-card">
                <div className="dashboard-review-card-body">
                  <h3 className="dashboard-review-card-title">New Review</h3>
                  <ReviewForm
                    setUserReviews={setUserReviews}
                    handleSeenListUpdate={handleSeenListUpdate}
                    seenListUpdated={seenListUpdated}
                    fetchReviewsWithMovieTitlesByUserId={
                      fetchReviewsWithMovieTitlesByUserId
                    }
                  />
                </div>
              </div>
            </div>

            <div className="dashboard-review-col-md-6">
              <div className="dashboard-review-card">
                <div className="dashboard-review-card-body">
                  <h3 className="dashboard-review-card-title">All Reviews</h3>
                  <ReviewDashboard
                    userReviews={userReviews}
                    setUserReviews={setUserReviews}
                    fetchReviewsWithMovieTitlesByUserId={
                      fetchReviewsWithMovieTitlesByUserId
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
