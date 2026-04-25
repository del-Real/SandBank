import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Home } from "./pages/Home";
import { Register } from "./pages/Auth/Register";
import { Login } from "./pages/Auth/Login";
import { ActivitiesList } from "./pages/Activities/ActivitiesList";
import { ActivityForm } from "./pages/Activities/ActivityForm";
import { MyRequests } from "./pages/Requests/MyRequests";
import { IncomingRequests } from "./pages/Requests/IncomingRequests";
import { TransactionHistory } from "./pages/Transactions/TransactionHistory";
import { AuthProvider, useAuth } from "./context/AuthContext";
import SandBank_logo from "./assets/SandBank_logo.svg";
import "./App.css";

function Nav() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header>
      <div className="top-header">
        <Link to="/">
          <img src={SandBank_logo} className="logo" alt="SandBank logo" />
        </Link>
        <nav className="nav-links">
          <Link to="/activities">Activities</Link>
          {isAuthenticated ? (
            <>
              <Link to="/activities/new">+ New</Link>
              <Link to="/requests/mine">My Requests</Link>
              <Link to="/requests/incoming">Incoming</Link>
              <Link to="/transactions">Credits</Link>
              <span className="nav-username">👤 {user?.username}</span>
              <button className="nav-logout" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          )}
        </nav>
      </div>
      <hr className="top-divider" />
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
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
