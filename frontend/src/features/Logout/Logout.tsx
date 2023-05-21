import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem("admin");
    localStorage.removeItem("role");
    navigate("/");
  }, [navigate]);
  return <div />;
};

export default Logout;
