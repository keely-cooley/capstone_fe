import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { MyThemeContext } from "../context/ThemeContext";
import { useUserContext } from "../context/UserContext";

export default function NavBar() {
  const { theme } = useContext(MyThemeContext);
  const { currentUser, handleUpdateUser } = useUserContext();

  return (
    <nav
      className="NavBar"
      style={{ backgroundColor: theme.background, color: theme.foreground }}
    >
      <ul className="menu">
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        {currentUser.email ? (
          <li>
            <NavLink onClick={() => handleUpdateUser({})}>Logout</NavLink>
          </li>
        ) : (
          <>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
            <li>
              <NavLink to="/signUp">Sign Up!</NavLink>
            </li>
          </>
        )}
        <li>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </li>
      </ul>
    </nav>
  );
}
