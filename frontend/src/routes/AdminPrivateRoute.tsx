import { Navigate, Outlet } from "react-router-dom";

const AdminPrivateRoute = () => {
  const admin = JSON.parse(localStorage.getItem("admin") || "{}");
  return admin.accessToken ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default AdminPrivateRoute;
