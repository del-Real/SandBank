import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import { Home } from "./pages/Home";
import { Register } from "./pages/Auth/Register";
import { Login } from "./pages/Auth/Login";
import SandBank_logo from "./assets/SandBank_logo.svg";
import "./App.css";

function App() {
  return (
    <>
      <header>
        <div className="top-header">
          <a href="/">
            <img src={SandBank_logo} className="logo" alt="SandBank logo" />
          </a>
        </div>
        <hr className="top-divider" />
      </header>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
