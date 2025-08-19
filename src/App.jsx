// import viteLogo from '/vite.svg'
import Header from "./components/Header";
import { AuthProvider } from "./contex/AuthContex";
import AppRoutes from "./routes/AppRoute";
function App() {
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
