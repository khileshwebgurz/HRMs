import axios from "axios";
export const admindashboard = async () => {
  const admindata = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/dashboard`,
    { withCredentials: true }
  );

  return admindata.data.data;
};
