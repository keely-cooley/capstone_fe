import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useUserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import MovieList from "../components/MovieList";
import MovieListHeading from "../components/MovieListHeading";
import SearchBox from "../components/SearchBox";
import AddMyList from "../components/AddMyList";
import RemoveMyList from "../components/RemoveMyList";
import PostForm from "../components/PostForm";
import PostList from "../components/PostList";
import "../css/DashboardPage.css";

function DashboardPage() {
  //CONDITIONAL RENDERING (cont. lines 74-86)
  //check to see if the user is logged in
  const { currentUser } = useUserContext();

  //STATE variables
  const [movies, setMovies] = useState([]);
  const [myList, setMyList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [userPosts, setUserPosts] = useState([]);

  const getMovieRequest = async (searchValue) => {
    //make request to API
    const url = `http://www.omdbapi.com/?s=${searchValue}&apikey=2aa94c15`;

    const response = await fetch(url);
    //convert response to json
    const responseJson = await response.json();

    console.log(responseJson);

    //UPDATING STATE - updates movies state when movie data is fetched succesfully
    //display no movies when app loads until searchValue is updated
    if (responseJson.Search) {
      setMovies(responseJson.Search);
    }
  };

  // MOUNTING
  useEffect(() => {
    getMovieRequest(searchValue); // Fetch movies on mount if searchValue is not empty
  }); // Runs only once on mount

  // UPDATING
  useEffect(() => {
    if (searchValue) {
      getMovieRequest(searchValue);
    }
  }, [searchValue]); // Runs when searchValue changes

  // load user's watch list from local storage
  useEffect(() => {
    const movieList =
      JSON.parse(localStorage.getItem("cinnefiles-my-list")) || [];
    setMyList(movieList);
  }, []);

  // save user's watch list to local storage
  const saveToLocalStorage = (items) => {
    localStorage.setItem("cinnefiles-my-list", JSON.stringify(items));
  };

  //add movie to list
  const addMovieToList = (movie) => {
    const newMyList = [...myList, movie];
    setMyList(newMyList);
    saveToLocalStorage(newMyList);
  };

  //remove movie from list
  //filter out movie from current list
  const removeMovie = (movie) => {
    console.log("removeMovie", myList, movie);
    setMyList((myList) => {
      const newMyList = myList.filter(
        (listed) => listed.imdbID !== movie.imdbID
      );
      saveToLocalStorage(newMyList);
      return newMyList;
    });
  };

  //CONDITIONAL RENDERING
  // check if user is logged in
  const isLoggedIn = currentUser.email;

  console.log("currentUser:", currentUser);

  console.log("IS LOGGED IN:", isLoggedIn);

  if (!isLoggedIn) {
    return (
      <div>
        <p>
          You need to log in to view this page, would you like to create a free
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
      {/* all movies */}
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
            handleMyListCLick={addMovieToList}
            myListComponent={AddMyList}
          />
        </div>
        {/* movies in user's list */}
        <div className="row d-flex align-items-center mt-4 mb-4">
          <div className="col text-center">
            <MovieListHeading heading="My List" />
          </div>
        </div>
        <div className="row">
          <MovieList
            movies={myList}
            handleMyListCLick={removeMovie}
            myListComponent={RemoveMyList}
          />
        </div>
      </div>

      {/* users reviews */}
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
