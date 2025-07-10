import axios from "axios";
import { useState, useEffect } from "react";
import { CandidateContext } from "../context/CandidateContext";
const CandidateProvider = ({ children }) => {
  const [data, setData] = useState([]);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/candidates`,
        { withCredentials: true }
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <CandidateContext.Provider value={data}>
      {children}
    </CandidateContext.Provider>
  );
};

export default CandidateProvider;
