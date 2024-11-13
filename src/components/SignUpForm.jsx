import { useState } from "react";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import "../css/SignUpPage.css";

function SignUpForm() {
  const [userEmail, setUserEmail] = useState("");
  const [username, setUsername] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitResult, setSubmitResult] = useState("");
  const [passwordCount, setPasswordCount] = useState(0);
  const [showForm, setShowForm] = useState(true);
  const navigate = useNavigate();

  const { currentUser, handleUpdateUser } = useUserContext();
  const maxPasswordCount = 5;

  const handleSubmit = async (e) => {
    e.preventDefault();
    //must be 8-15 characters, conatin upper and lowercase letter, number, and special character
    let regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;

    if (passwordCount === maxPasswordCount) {
      setShowForm(false);
    }

    //password validation
    if (userPassword.length < 5) {
      setPasswordCount(passwordCount + 1);
      setSubmitResult("Password must be at least 5 characters long");
    } else if (userPassword === userEmail) {
      setPasswordCount(passwordCount + 1);
      setSubmitResult("Password must not match email address");
    } else if (regex.test(userPassword) === false) {
      //must include character not a letter
      setPasswordCount(passwordCount + 1);
      setSubmitResult(
        "Passwords require a special character, lowercase/uppercase, digit, be between 8-15 chars"
      );
    } else if (userPassword !== confirmPassword) {
      //confirm password and confirm password are the same
      setPasswordCount(passwordCount + 1);
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
          setSubmitResult("Welcome To Cinnefiles!");

          handleUpdateUser({ email: userEmail, username: username });
          console.log("NEW USER LOGGING IN:", currentUser);
          
          //redirect to dashboard
          navigate("/dashboard");
        } else {
          setSubmitResult(data.result);
        }
      } catch (error) {
        setSubmitResult("An error occurred. ", error);
      }
    }

    console.log("handleSubmit:", "passwordCount:", passwordCount);
  };

  if (currentUser.username)
    return (
      <>
        <p>Hi, {currentUser.username}! You are currently logged in.</p>
        <button className="button" onClick={() => handleUpdateUser({})}>
          Log Out
        </button>
      </>
    );

  return (
    <div className="SignUpForm componentBox">
      <h2 className="login-header">Sign Up</h2>
      {showForm && (
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
          </div>

          <div className="formRow">
            <label>
              Confirm Password:
              <input
                type="password"
                value={confirmPassword}
                name="confirmPassword"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
          </div>

          <button className="button">Sign Up!</button>
          <p>{submitResult}</p>
        </form>
      )}
    </div>
  );
}

export default SignUpForm;
