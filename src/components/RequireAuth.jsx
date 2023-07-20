import { useSelector } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const RequireAuth = ({ allowedRoles }) => {
  const sessionUser = useSelector((state) => state.statusVar.value.sessionUser);
  const location = useLocation();
  // console.log(allowedRoles);
  return !sessionUser ? (
    <Navigate to="/" state={{ from: location }} replace />
  ) : !allowedRoles ? (
    <Outlet />
  ) : sessionUser?.roles?.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  );
};

export default RequireAuth;
