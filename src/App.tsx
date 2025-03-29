import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Signup } from "./pages/signup";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import LoadingScreen from "./components/LoadingScreen";
import Dashboard from "./pages/protected";
import { Login } from "./pages/login";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const authState = useSelector((state: RootState) => state.auth);
  // Only show loading screen if we're authenticated but waiting for user data
  if (authState.isAuthenticated && authState.loading) {
    return <LoadingScreen message="Verifying access..." />;
  }

  if (!authState.isAuthenticated) {
    return <Navigate to={`/login`} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
      <Route
          path="/login"
          element={
              <Login />
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
