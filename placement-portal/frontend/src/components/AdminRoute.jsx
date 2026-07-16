import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { token, user } = useAuth();

  if (!token) {
    console.log("No token");
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    console.log("User is null");
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    console.log("Role is:", user.role);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;