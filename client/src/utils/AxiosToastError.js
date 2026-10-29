import toast from 'react-hot-toast';

const AxiosToastError = (error) => {
    if (!error) return;

    let message = "An unexpected error occurred";

    if (typeof error === "string") {
        message = error;
    } else if (error?.response?.data?.message) {
        message = typeof error.response.data.message === "string" 
            ? error.response.data.message 
            : JSON.stringify(error.response.data.message);
    } else if (error?.message) {
        message = error.message;
    } else if (typeof error === "object") {
        try {
            message = error.statusText || error.code || JSON.stringify(error);
        } catch {
            message = "An error occurred";
        }
    }

    toast.error(message);
};

export default AxiosToastError;
