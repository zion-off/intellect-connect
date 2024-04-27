import "./App.css";
import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { auth } from "./firebase";
import Welcome from "./pages/welcome";
import Settings from "./pages/settings";
import Register from "./pages/register";
import Read from "./pages/read";
import Profile from "./pages/profile";
import Friends from "./pages/friends";
import Login from "./pages/login";
import Discussion from "./pages/discussion";
import Create from "./pages/create";
import Communities from "./pages/communities";
import CommunityDetails from "./pages/communitydetails";
import ProtectedRoute from "./pages/protected";

function AuthRedirect({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/communities");
      }
    });

    return unsubscribe;
  }, [navigate]);

  return children;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route
            path="/settings"
            element={<ProtectedRoute component={Settings} />}
          />
          <Route
            path="/register"
            element={
              <AuthRedirect>
                <Register />
              </AuthRedirect>
            }
          />
          <Route
            path="/read/:id"
            element={<ProtectedRoute component={Read} />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute component={Profile} />}
          />
          <Route
            path="/friends"
            element={<ProtectedRoute component={Friends} />}
          />
          <Route
            path="/login"
            element={
              <AuthRedirect>
                <Login />
              </AuthRedirect>
            }
          />
          <Route
            path="/discussion/:id"
            element={<ProtectedRoute component={Discussion} />}
          />
          <Route
            path="/create"
            element={<ProtectedRoute component={Create} />}
          />
          <Route
            path="/communities"
            element={<ProtectedRoute component={Communities} />}
          />
          <Route
            path="/community/:id"
            element={<ProtectedRoute component={CommunityDetails} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
