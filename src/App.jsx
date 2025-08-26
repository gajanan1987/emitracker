import { useEffect } from "react";
import Header from "./components/Header";
import { AuthProvider } from "./contex/AuthContex";
import AppRoutes from "./routes/AppRoute";
import { useDispatch, useSelector } from "react-redux";
import { fetchSession } from "./redux/authSlice";
function App() {
  const dispatch = useDispatch();
  const { status, error, user } = useSelector((s) => s.auth);
  useEffect(() => {
    if (!user) {
      dispatch(fetchSession());
    }
  }, [dispatch]);
  return (
    <>
      <AuthProvider>
        <Header />
        <div className="conatiner-common">
          <AppRoutes />
        </div>
      </AuthProvider>
    </>
  );
}

export default App;
