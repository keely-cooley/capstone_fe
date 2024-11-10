import { Outlet, Navigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

function ProtectedRoute({ redirectPath = "/login", children }) {
  const { currentUser } = useUserContext();

  if (!currentUser.email) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
