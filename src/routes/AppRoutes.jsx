import { Route, Routes } from "react-router-dom"
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import LandingPage from "../pages/LandingPage";
import SignUpPage from "../pages/SignUpPage";
import ProtectedRoute from "../components/ProtectedRoute";
import MovieDetails from "../components/MovieDetails";

function AppRoutes() {

    return (
    <Routes>
    <Route index element={<LandingPage />} />
    {/* dashboard */}
    <Route path="/dashboard" element={
        <ProtectedRoute>
            <DashboardPage />
        </ProtectedRoute>
    } />
    <Route path="login" element={<LoginPage />} />
    <Route path="signUp" element={<SignUpPage />} />
    <Route path="dashboard" element={<DashboardPage />} />
    <Route path="movie/:movieId" element={<MovieDetails /> } />
        
    </Routes>
    )
    }
    
    export default AppRoutes;