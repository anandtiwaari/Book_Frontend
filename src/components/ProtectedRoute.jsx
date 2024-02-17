import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const ProtectedRoute = ({ Component }) => {
  let token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      return navigate("/");
    }
  }, [token]);
  return (
    <div>
      <Component />
    </div>
  );
};

export default ProtectedRoute;
