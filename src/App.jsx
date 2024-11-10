import NavBar from "./components/NavBar";
import MyThemeProvider from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <>
      <UserProvider>
        <MyThemeProvider>
          <BrowserRouter>
            <NavBar />
            <AppRoutes />
          </BrowserRouter>
        </MyThemeProvider>
      </UserProvider>
    </>
  );
}

export default App;
