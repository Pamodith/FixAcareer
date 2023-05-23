import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AdminDashboard, Home } from "../pages";
import { AdminLogin, Logout } from "../features";
import AdminPrivateRoute from "./AdminPrivateRoute";

const MainRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/logout" element={<Logout />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPrivateRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route
            path="/admin/dashboard/:tabValue"
            element={<AdminDashboard />}
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default MainRoutes;
