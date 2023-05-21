import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "../pages";
import { AdminLogin, Logout } from "../features";

const MainRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
};

export default MainRoutes;
