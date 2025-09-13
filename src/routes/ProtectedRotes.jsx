import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";
useAuth;

const ProtectedRotes = () => {
  const { session, loading } = useAuth();
  const { status, error, user } = useSelector((s) => s.auth);

  // 1. While Supabase is checking the session
  if (loading || status === "loading") {
    return <p>Loading...</p>;
  }

  // 2. If session is null AND no Redux user → redirect to login
  if (!session && !user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Otherwise, render protected routes
  return <Outlet />;
};

export default ProtectedRotes;
