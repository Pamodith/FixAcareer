import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem("admin");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  }, [navigate]);
  return <div />;
};

export default Logout;
