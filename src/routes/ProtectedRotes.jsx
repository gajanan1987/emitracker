import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contex/Contex.jsx";

const ProtectedRotes = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default ProtectedRotes;
