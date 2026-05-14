import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Home } from "./pages/Home";
import { Register } from "./pages/Auth/Register";
import { Login } from "./pages/Auth/Login";
import { ActivitiesList } from "./pages/Activities/ActivitiesList";
import { ActivityForm } from "./pages/Activities/ActivityForm";
import { MyRequests } from "./pages/Requests/MyRequests";
import { IncomingRequests } from "./pages/Requests/IncomingRequests";
import { TransactionHistory } from "./pages/Transactions/TransactionHistory";
import { BuyCredits } from "./pages/Credits/BuyCredits";
import { AdminPanel } from "./pages/Admin/AdminPanel";
import { AuthProvider, useAuth } from "./context/AuthContext";
import SandBank_logo from "./assets/SandBank_logo.svg";
import "./App.css";

function Nav() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header>
      <div className="top-header">
        {/* Left: Logo */}
        <div className="nav-left">
          <Link to="/">
            <img src={SandBank_logo} className="logo" alt="SandBank logo" />
          </Link>
        </div>

        {/* Center: Main nav links */}
        <nav className="nav-center">
          <Link to="/activities">Activities</Link>
          {isAuthenticated && (
            <>
              <Link to="/requests/mine">Requests</Link>
              <Link to="/transactions">History</Link>
              {user?.role === "Admin" && <Link to="/admin">— Admin Panel</Link>}
            </>
          )}
          {!isAuthenticated && (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register">Sign up</Link>
            </>
          )}
        </nav>

        {/* Right: User info */}
        <div className="nav-right">
          {isAuthenticated ? (
            <>
              <span className="nav-username">{user?.username}</span>
              <button className="nav-logout" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <div /> /* keeps layout balanced when logged out */
          )}
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Nav />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/activities" element={<ActivitiesList />} />
            <Route path="/activities/new" element={<ActivityForm />} />
            <Route path="/activities/:id/edit" element={<ActivityForm />} />
            <Route path="/requests/mine" element={<MyRequests />} />
            <Route path="/requests/incoming" element={<IncomingRequests />} />
            <Route path="/transactions" element={<TransactionHistory />} />
            <Route path="/credits" element={<BuyCredits />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
