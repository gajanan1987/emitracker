import { useContext } from "react";
import { AuthContex } from "./AuthContex";

export const useAuth = () => useContext(AuthContex);
