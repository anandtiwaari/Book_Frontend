import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const PrivateRoute = ({ Component }) => {
  const navigate = useNavigate();
  let Token = localStorage.getItem("accessToken");
  useEffect(() => {
    if (!Token) {
      return navigate("/Login");
    }
  }, [Token]);
  return (
    <div>
      <Component />
    </div>
  );
};

export default PrivateRoute;
