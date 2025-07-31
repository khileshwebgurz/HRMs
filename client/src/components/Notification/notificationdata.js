import axios from "axios";

export const notificationdata = async () => {
  const Notify = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/employee/notification`,
    { withCredentials: true }
  );

  return Notify.data.data;
};
