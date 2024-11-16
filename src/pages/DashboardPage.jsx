import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useUserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import MovieList from "../components/MovieList";
import MovieListHeading from "../components/MovieListHeading";
import SearchBox from "../components/SearchBox";
import AddMyList from "../components/AddMyList";
import AddSeenList from "../components/AddSeenList";
import RemoveMyList from "../components/RemoveMyList";
import PostForm from "../components/PostForm";
import PostList from "../components/PostList";
import "../css/DashboardPage.css";

function DashboardPage() {
  // check to see if the user is logged in
  const { currentUser } = useUserContext();

  // STATE variables
  const [movies, setMovies] = useState([]);
  const [myList, setMyList] = useState([]);
  const [seenList, setSeenList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [userPosts, setUserPosts] = useState([]);

  const getMovieRequest = async (searchValue) => {
    // make request to API
    const url = `http://www.omdbapi.com/?s=${searchValue}&apikey=2aa94c15`;

    const response = await fetch(url);
    // convert response to JSON
    const responseJson = await response.json();

    console.log(responseJson);

    // UPDATING STATE - updates movies state when movie data is fetched successfully
    if (responseJson.Search) {
      setMovies(responseJson.Search);
    }
  };

  // useEffect to fetch movies based on searchValue
  useEffect(() => {
    if (searchValue) {
      getMovieRequest(searchValue);
    }
  }, [searchValue]);

  // load user's watch list and seen list from local storage
  useEffect(() => {
    const movieList =
      JSON.parse(localStorage.getItem("cinnefiles-my-list")) || [];
    const seenMovies =
      JSON.parse(localStorage.getItem("cinnefiles-seen-list")) || [];
    setMyList(movieList);
    setSeenList(seenMovies);
  }, []);

  // save both lists to localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem("cinnefiles-my-list", JSON.stringify(myList));
    localStorage.setItem("cinnefiles-seen-list", JSON.stringify(seenList));
  };

  // add movie to 'my list'
  const addMovieToList = (movie) => {
    const newMyList = [...myList, movie];
    setMyList(newMyList);
    saveToLocalStorage();
  };

  // add movie to 'seen list' and remove from 'my list'
  const addMovieToSeen = (movie) => {
    const newMyList = myList.filter((item) => item.imdbID !== movie.imdbID);
    const newSeenList = [...seenList, movie];

    setMyList(newMyList);
    setSeenList(newSeenList);
    saveToLocalStorage();
  };

  // remove movie from 'seen list'
  const removeMovie = (movie) => {
    console.log("Removing movie:", movie);
    setMyList((seenList) => {
      console.log("Current seenList:", seenList);
      const newSeenList = seenList.filter(
        (listed) => listed.imdbID !== movie.imdbID
      );
      console.log("New seenList:", newSeenList);
      saveToLocalStorage(newSeenList);
      return newSeenList;
    });
  };

  // CONDITIONAL RENDERING - Check if user is logged in
  const isLoggedIn = currentUser.email;

  if (!isLoggedIn) {
    return (
      <div>
        <p>
          You need to log in to view this page. Would you like to create a free
          Cinnefiles account?
        </p>
        <Link to="/signUp" className="btn btn-primary">
          Create My Free Account!
        </Link>
        <p>Already have an account?</p>
        <Link to="/login" className="btn btn-primary">
          Sign in here!
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* All movies */}
      <div className="container-fluid movie-app">
        <div className="row d-flex align-items-center mt-4 mb-4">
          <div className="col text-center">
            <MovieListHeading heading="Search for a movie" />
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
            addMovieToSeen={addMovieToSeen}
            // myListComponent={AddMyList}
          />
        </div>

        {/* Movies in user's 'My List' */}
        <div className="row d-flex align-items-center mt-4 mb-4">
          <div className="col text-center">
            <MovieListHeading heading="My List" />
          </div>
        </div>
        <div className="row">
          <MovieList
            movies={myList}
            addMovieToList={addMovieToList}
            addMovieToSeen={addMovieToSeen}
          />
        </div>

        {/* Movies in user's 'Seen List' */}
        <div className="row d-flex align-items-center mt-4 mb-4">
          <div className="col text-center">
            <MovieListHeading heading="Movies You've Seen" />
          </div>
        </div>
        <div className="row">
          <MovieList
            movies={seenList}
            addMovieToList={addMovieToList}
            addMovieToSeen={addMovieToSeen}
          />
        </div>
      </div>

      {/* User's Reviews */}
      <div className="container mt-4">
        <h2 className="text-center mb-4">My Reviews</h2>

        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h3 className="card-title">New Review</h3>
                <PostForm setUserPosts={setUserPosts} />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h3 className="card-title">Your Reviews</h3>
                <PostList userPosts={userPosts} setUserPosts={setUserPosts} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
