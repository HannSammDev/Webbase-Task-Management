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
import { Calendar } from "./component/Calendar";
import { Test } from "./pages/test";
import { RegisterForm } from "./component/RegisterForm";
import { AuthProvider } from "./Auth/AuthContex";
import { ProtectedRoute } from "./Auth/ProtectedRoute";
const App = () => (
  <AuthProvider>
    <PrimeReactProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* 👇 Protect the whole dashboard once here */}

          <Route element={<ProtectedRoute />}>
            <Route element={<Dash_Board />}>
              <Route path="/overview" element={<Totals />} />
              <Route path="/mytask" element={<MyTask />} />
              <Route path="/kanban" element={<Kanban />} />
              <Route path="/calendar" element={<Calendar />} />
            </Route>
          </Route>

          <Route path="/test" element={<Test />} />
          <Route path="*" element={<div className="p-4">Page Not Found</div>} />
        </Routes>
      </Router>
    </PrimeReactProvider>
  </AuthProvider>
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
