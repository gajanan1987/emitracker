import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

const ProtectedRotes = () => {
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
