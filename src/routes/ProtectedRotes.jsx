import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contex/Contex.jsx";
import { useSelector } from "react-redux";

const ProtectedRotes = () => {
  // const { user, loading } = useAuth();
  const { status, error, user } = useSelector((s) => s.auth);

  if (status === "loading") return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default ProtectedRotes;
