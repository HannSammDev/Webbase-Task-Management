import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PrimeReactProvider, PrimeReactContext } from "primereact/api";
import "./index.css";
import Layout from "./Layout";
import { Dash_Board } from "./dashboard";
import { Totals } from "./component/Totals";
import { MyTask } from "./pages/Dashboard/MyTask";
import { Kanban } from "./pages/Dashboard/Kanban";
const App = () => (
  <PrimeReactProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route element={<Dash_Board/>}>
          <Route path="/overview" element={<Totals />} />
          <Route path="/mytask" element={<MyTask />} />
        </Route>
        <Route path='/kanban' element={<Kanban/>} />
        <Route path="*" element={<div className="p-4">Page Not Found</div>} />
      </Routes>
    </Router>
  </PrimeReactProvider>
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
