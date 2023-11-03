import { toast } from "react-toastify";

export const errorToast = (message?: string) => {
  return toast.error(message || "Une erreur s'est produite.", {
    position: "top-right",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    pauseOnFocusLoss: true,
    draggable: true,
    progress: undefined,
    theme: "colored"
  });
};

export const successToast = (message?: string) => {
  return toast.success(message || "Demande réussie.", {
    position: "top-right",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    pauseOnFocusLoss: true,
    draggable: true,
    progress: undefined,
    theme: "colored"
  });
};
