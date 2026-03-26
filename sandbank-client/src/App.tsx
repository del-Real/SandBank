import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import { Register } from "./pages/Auth/Register";
import SandBank_logo from "./assets/SandBank_logo.svg";
import "./App.css";

function App() {
  return (
    <>
      <section id="header">
        <div>
          <img src={SandBank_logo} alt="SandBank logo" />
          <hr />
          <h2>Your time is the most valuable currency</h2>
        </div>
      </section>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
