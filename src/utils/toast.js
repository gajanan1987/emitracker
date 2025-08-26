import { toast } from "react-toastify";

const custMessage = {
  success: (msg) => toast.success(msg || "Success ✅"),
  error: (msg) => toast.error(msg || "Something went wrong ❌"),
  info: (msg) => toast.info(msg || "Info ℹ️"),
  warning: (msg) => toast.warning(msg || "Warning ⚠️"),
};

export default custMessage;
