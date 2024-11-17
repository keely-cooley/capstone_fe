import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useUserContext } from "../context/UserContext";
// import { Link } from "react-router-dom";
import MovieList from "../components/MovieList";
import MovieListHeading from "../components/MovieListHeading";
import SearchBox from "../components/SearchBox";
// import AddMyList from "../components/AddMyList";
// import AddSeenList from "../components/AddSeenList";
// import RemoveMyList from "../components/RemoveMyList";
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

    try {
      const response = await fetch(url);
      // convert response to JSON
      const responseJson = await response.json();
      console.log(responseJson);
  
      // UPDATING STATE - updates movies state when movie data is fetched successfully
      if (responseJson.Search) {
        setMovies(responseJson.Search);
      } else {
        console.log("No movies found.")
      }
    } catch (error) {
      console.log("Error fetching movies:", error)
    }
  };

  // useEffect to fetch movies based on searchValue
  useEffect(() => {
    if (searchValue) {
      getMovieRequest(searchValue);
    }
  }, [searchValue]);

  //any time the page loads, load my list from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8083/listedMovies/user/${currentUser.userId}`
        );
        const data = await response.json();
        setMyList(data);
      } catch (error) {
        console.log("DashboardPage.jsx.jsx : an error occurred", error);
      }
    };
    fetchData();
  }, [currentUser.userId]);

  // save both lists to localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem("cinnefiles-my-list", JSON.stringify(myList));
    localStorage.setItem("cinnefiles-seen-list", JSON.stringify(seenList));
  };

  // add movie to 'my list'
  const addMovieToList = async (movie) => {
    //check if movie already exists in 'my list'
    if (myList.some((check) => check.imdbID === movie.imdbID)) {
      console.log("Movie is already in your list");
      return; //?? what should I return here to display already in list to user
    }

    const newMyList = [...myList, movie];
    setMyList(newMyList);
    // saveToLocalStorage();
    console.log("addMovieToList", currentUser.userId);

    try {
      //validate the movie
      const validationResponse = await fetch(
        `http://localhost:8083/movies/validate/${movie.imdbID}`
      );
      const validationJson = await validationResponse.json();
      console.log(validationJson.id);
      if (validationResponse.ok) {
        //create new listed movie object
        const newListedMovie = {
          userId: currentUser.userId,
          movieId: validationJson.id,
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
        console.log("movie validation failed");
      }
    } catch (error) {
      console.log("setMyList - validate movie", error);
    }
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
  const removeSeenMovie = (movie) => {
    console.log("Removing movie:", movie);
    const newSeenList = seenList.filter(
      (listed) => listed.imdbID !== movie.imdbID
    );
    console.log(newSeenList);
    setSeenList(newSeenList);
    saveToLocalStorage();
  };

  // remove from 'my list'
  const removeListMovie = (movie) => {
    console.log("Removing movie:", movie);
    const newMyList = myList.filter((listed) => listed.imdbID !== movie.imdbID);
    console.log(newMyList);
    setMyList(newMyList);
    saveToLocalStorage();
  };

  // // CONDITIONAL RENDERING - Check if user is logged in
  // const isLoggedIn = currentUser.email;

  // if (!isLoggedIn) {
  //   return (
  //     <div>
  //       <p>
  //         You need to log in to view this page. Would you like to create a free
  //         Cinnefiles account?
  //       </p>
  //       <Link to="/signUp" className="btn btn-primary">
  //         Create My Free Account!
  //       </Link>
  //       <p>Already have an account?</p>
  //       <Link to="/login" className="btn btn-primary">
  //         Sign in here!
  //       </Link>
  //     </div>
  //   );
  // }

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
            removeMovie={null}
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
            addMovieToList={null}
            addMovieToSeen={addMovieToSeen}
            removeMovie={removeListMovie}
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
            addMovieToList={null}
            addMovieToSeen={null}
            removeMovie={removeSeenMovie}
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
