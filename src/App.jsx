import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import "./index.css";
import Layout from "./Layout";
import { DashboardLayout } from "./layout/DashboardLayout";
import { Totals } from "./features/tasks/Totals";
import { MyTask } from "./pages/Dashboard/MyTask";
import { Kanban } from "./pages/Dashboard/Kanban";
import { Calendar } from "./features/tasks/Calendar";
import { Test } from "./pages/test";
import { RegisterForm } from "./features/auth/RegisterForm";
import { ForgotPassword } from "./features/auth/ForgotPassword";
import { AuthProvider } from "./Auth/AuthContext.jsx";
import { ProtectedRoute } from "./Auth/ProtectedRoute";
import { Teams } from "./pages/teams/teams";

const App = () => (
  <AuthProvider>
    <PrimeReactProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/overview" element={<Totals />} />
              <Route path="/mytask" element={<MyTask />} />
              <Route path="/kanban" element={<Kanban />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/team" element={<Teams />} />
            </Route>
          </Route>

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/test" element={<Test />} />
          <Route path="*" element={<div className="p-4">Page Not Found</div>} />
        </Routes>
      </Router>
    </PrimeReactProvider>
  </AuthProvider>
);

export default App;
