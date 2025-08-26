import React, { useEffect, useState } from "react";
import axios from "axios";

function CompanyProfileEdit() {
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/edit-company-profile`,
          { withCredentials: true }
        );
        console.log("API Response >>>", data); // 👈 check console
        setCompany(data);
      } catch (error) {
        console.error("Error fetching company profile:", error);
      }
    };

    fetchCompany();
  }, []);

  return (
    <div>
      <h2>Company Profile Edit</h2>
      {company ? (
        <pre>{JSON.stringify(company, null, 2)}</pre> 
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default CompanyProfileEdit;
