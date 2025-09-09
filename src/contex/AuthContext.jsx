import { createContext, useEffect, useState } from "react";
import { addNewUser, getUser, loginUser, logoutUser } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---- Email Sign In ----
  const signIn = async (user, pwd) => {
    const data = await loginUser(user, pwd);
    if (data?.user) {
      setUser(data.user);
    }
    return data;
  };

  // ---- Email Sign Up ----
  const signUpWithEmail = async (email, password) => {
    const data = await addNewUser(email, password);
    if (data?.user) setUser(data.user);
    return data;
  };

  // ---- Sign Out ----
  const signOut = async () => {
    await logoutUser();
    setUser(null);
  };

  useEffect(() => {
    async function fn() {
      const data = await getUser();
      setUser(data?.session?.user || null);
      setLoading(false);
    }
    fn();
  }, []);

  return (
    <AuthContext.Provider
      value={{ signIn, signOut, signUpWithEmail, user, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
