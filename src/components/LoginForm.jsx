import { useState } from "react";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [submitResult, setSubmitResult] = useState("");
  const { currentUser, handleUpdateUser } = useUserContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // make API call to backend
    try {
      const response = await fetch("http://localhost:8083/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail, password: userPassword }),
      });

      const data = await response.json();
      // console.log(data)

      if (response.ok) {
        const { email, username } = data;

        console.log("USER EMAIL: ", email);
        console.log("USERNAME: ", username);
        handleUpdateUser({ email, username });
        // console.log("LOGGING IN:", currentUser);

        //redirect to dashboard on successful login
        navigate("/dashboard");
      } else {
        console.log(data);
        setSubmitResult(data);
      }
    } catch (error) {
      console.log("LoginForm.jsx : an error occurred during login", error)
      setSubmitResult("An error occurred during login. ", error);
    }
  };

  if (currentUser.email)
    return (
      <>
        <p>Hi, {currentUser.username}! You are currently logged in.</p>
        <button className="button" onClick={() => handleUpdateUser({})}>Log Out</button>
      </>
    );

  return (
    <div className="LoginForm componentBox">
      <h2 className="login-header">Login</h2>
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
            Password:
            <input
              type="password"
              value={userPassword}
              name="password"
              onChange={(e) => setUserPassword(e.target.value)}
            />
          </label>
        </div>
        <button className="button">Log In</button>
        <p>{submitResult}</p>
      </form>
    </div>
  );
}

export default LoginForm;
