import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  AdminDashboard,
  Home,
  IQTest,
  JobCategories,
  UserHome,
} from "../pages";
import { AdminLogin, Logout, UserLogin } from "../features";
import AdminPrivateRoute from "./AdminPrivateRoute";
import UserPrivateRoute from "./UserPrivateRoute";

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

        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user" element={<UserPrivateRoute />}>
          <Route path="/user" element={<UserHome />} />
          <Route path="/user/iq-test" element={<IQTest />} />
          <Route path="/user/job-categories" element={<JobCategories />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default MainRoutes;
