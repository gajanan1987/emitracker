// import viteLogo from '/vite.svg'
import Header from "./components/Header";
import { AuthProvider } from "./contex/AuthContex";
import AppRoutes from "./routes/AppRoute";
function App() {
  return (
    <>
      <AuthProvider>
        <Header />
        <AppRoutes />
      </AuthProvider>
    </>
  );
}

export default App;
