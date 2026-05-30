import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PrimeReactProvider, PrimeReactContext } from "primereact/api";
import "./index.css";
import Layout from "./Layout";
import { Dash_Board } from "./pages/Dashboard/dashboard";

const App = () => (
  <PrimeReactProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/dashboard" element = {<Dash_Board/>}/>
      </Routes>
    </Router>
  </PrimeReactProvider>
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
