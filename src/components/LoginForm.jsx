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

      if (response.ok) {
        console.log("USER EMAIL:", userEmail);
        handleUpdateUser({ email: userEmail });
        console.log("LOGGING IN:", currentUser);
        //redirect to dashboard on successful login
        navigate("/dashboard");
      } else {
        setSubmitResult(data.result);
      }
    } catch (error) {
      setSubmitResult("An error occurred during login. ", error);
    }
  };

  if (currentUser.email)
    return (
      <>
        <p>Welcome {currentUser.email}</p>
        <button onClick={() => handleUpdateUser({})}>Log Out</button>
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
        <button>Log In</button>
        <p>{submitResult}</p>
      </form>
    </div>
  );
}

export default LoginForm;
