import { Navigate, Outlet } from "react-router-dom";

const UserPrivateRoute = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.accessToken ? <Outlet /> : <Navigate to="/user/login" />;
};

export default UserPrivateRoute;
