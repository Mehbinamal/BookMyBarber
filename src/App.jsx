import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

// Pages
import LandingPage from "./Pages/LandingPage";
import SetupProfile from "./Pages/SetupProfile";
import BarberDashboard from "./Pages/BarberDashboard";
import CustomerDashboard from "./Pages/CustomerDashboard";

function OAuthCallback() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Completing sign-in...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setStatus("Processing authentication...");
        
        // Wait for authentication to complete
        if (auth.isLoading) {
          // Wait for loading to finish
          const checkAuth = setInterval(() => {
            if (!auth.isLoading) {
              clearInterval(checkAuth);
              handleAuthComplete();
            }
          }, 100);
          return;
        }
        
        handleAuthComplete();
      } catch (error) {
        console.error("OAuth callback error:", error);
        setStatus("Authentication failed. Please try again.");
      }
    };

    const handleAuthComplete = () => {
      if (auth.isAuthenticated) {
        setStatus("Authentication successful! Redirecting...");
        // Small delay to show success message
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1000);
      } else if (auth.error) {
        setStatus(`Authentication error: ${auth.error.message}`);
      } else {
        setStatus("Authentication failed. Please try again.");
      }
    };

    handleCallback();
  }, [auth.isLoading, auth.isAuthenticated, auth.error, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Book My Barber</h2>
      <p>{status}</p>
      {auth.error && (
        <button onClick={() => navigate("/")}>Return to Home</button>
      )}
    </div>
  );
}

function AppContent() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (auth.isLoading) return;

    if (auth.isAuthenticated) {
      const tokenGroups = auth.user?.profile?.["cognito:groups"];
      const tokenRole = tokenGroups?.[0];
      setRole(tokenRole || null);
    } else {
      setRole(null);
    }

    setLoading(false);
  }, [auth.isAuthenticated, auth.isLoading]);

  const signOutRedirect = () => {
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID; // your Cognito App client ID
    const logoutUri = "http://localhost:5173"; // or your production domain
    const cognitoDomain =import.meta.env.VITE_COGNITO_DOMAIN; // your actual Cognito domain
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  if (auth.isLoading || loading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Error: {auth.error.message}</div>;
  }

  return (
    <>
      <Routes>
        {/* OAuth callback route */}
        <Route 
          path="/" 
          element={
            location.search.includes("code=") && location.search.includes("state=") ? (
              <OAuthCallback />
            ) : auth.isAuthenticated ? (
              // If authenticated, redirect based on role
              role ? (
                role.toLowerCase() === "barber" ? (
                  <Navigate to="/barber-dashboard" replace />
                ) : role.toLowerCase() === "customer" ? (
                  <Navigate to="/customer-dashboard" replace />
                ) : (
                  <Navigate to="/setup-profile" replace />
                )
              ) : (
                <Navigate to="/setup-profile" replace />
              )
            ) : (
              // If not authenticated, show landing page
              <LandingPage onSignIn={() => auth.signinRedirect()} />
            )
          } 
        />

        {/* Barber Dashboard */}
        <Route path="/barber-dashboard" element={<BarberDashboard />} />

        {/* Customer Dashboard */}
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />

        {/* Profile Setup */}
        <Route path="/setup-profile" element={<SetupProfile auth={auth} />} />

        {/* Catch all - redirect to appropriate page */}
        <Route 
          path="*" 
          element={
            auth.isAuthenticated ? (
              role ? (
                role.toLowerCase() === "barber" ? (
                  <Navigate to="/barber-dashboard" replace />
                ) : role.toLowerCase() === "customer" ? (
                  <Navigate to="/customer-dashboard" replace />
                ) : (
                  <Navigate to="/setup-profile" replace />
                )
              ) : (
                <Navigate to="/setup-profile" replace />
              )
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>

      {auth.isAuthenticated && (
        <div style={{ padding: "20px" }}>
          <p>Hello, {auth.user?.profile?.email}</p>
          <button onClick={signOutRedirect}>Sign out</button>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
