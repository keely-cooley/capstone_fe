import { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import "../css/SignUpPage.css";
import UserStatus from "./UserStatus";

function SignUpForm() {
  const [userEmail, setUserEmail] = useState("");
  const [username, setUsername] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitResult, setSubmitResult] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const { currentUser, handleUpdateUser } = useUserContext();
  const navigate = useNavigate();


  //function to check if passwords match in real-time
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value === userPassword) {
      setPasswordsMatch(true); 
    } else {
      setPasswordsMatch(false); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //password validation: must be 8-15 characters, contain upper and lowercase letter, number, and special character
    let regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;

    //password validation
    if (userPassword.length < 8) {
      setSubmitResult("Password must be at least 8 characters long");
    } else if (userPassword === userEmail) {
      setSubmitResult("Password cannot match email address");
    } else if (regex.test(userPassword) === false) {
      setSubmitResult(
        "Passwords require a special character, lowercase/uppercase, digit, be between 8-15 chars"
      );
    } else if (!passwordsMatch) {
      //confirm 'password' and 'confirm password' are the same
      setSubmitResult("Passwords do not match");
    } else {
      // make API call to backend
      try {
        const response = await fetch("http://localhost:8083/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            username: username,
            password: userPassword,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log("NEW USER EMAIL:", userEmail);
          // setSubmitResult("Welcome To Cinnefiles!");

          handleUpdateUser({ email: userEmail, username: username });
          console.log("NEW USER LOGGING IN:", currentUser);

          //redirect to dashboard
          setSubmitResult("");
        } else {
          setSubmitResult(data.result);
        }
      } catch (error) {
        setSubmitResult("An error occurred. ", error);
      }
    }
  };

  useEffect(() => {
    if (currentUser?.email) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate])

  return (
    <div className="SignUpForm componentBox">
      <h2 className="login-header">Sign Up</h2>

      <UserStatus /> {/* displays alternative message if user is already logged in*/}

      {!currentUser.username && ( //if user is not logged in, display sign up form
        <form onSubmit={handleSubmit}>
          <div className="formRow">
            <label>
              Email Address:
              <input
                type="email"
                value={userEmail}
                name="userEmail"
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </label>
          </div>

          <div className="formRow">
            <label>
              Username:
              <input
                type="username"
                value={username}
                name="username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
          </div>

          <div className="formRow">
            <label>
              Password:
              <input
                type="password"
                value={userPassword}
                name="password"
                onChange={(e) => setUserPassword(e.target.value)}
              />
            </label>
            {/* Display password requirements */}
            <p className="signup-password-requirements">
              Password must be 8-15 characters and include at least one lowercase letter, one uppercase letter, one number, and one special character.
            </p>
          </div>

          <div className="formRow">
            <label>
              Confirm Password:
              <input
                type="password"
                value={confirmPassword}
                name="confirmPassword"
                onChange={handleConfirmPasswordChange}
              />
            </label>
            {!passwordsMatch && (
              <p className="error-message">Passwords must match</p>
            )}
          </div>

          <button className="button">Sign Up!</button>
          <p>{submitResult}</p>
        </form>
      )}
    </div>
  );
}

export default SignUpForm;
