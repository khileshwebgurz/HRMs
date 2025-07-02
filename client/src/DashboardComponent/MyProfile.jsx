import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import PersonalInfo from "./MyProfileComponent/PersonalInfo";
import BasicInfo from "./MyProfileComponent/BasicInfo";
import AppraisalInfo from "./MyProfileComponent/AppraisalInfo";

import { useNavigate } from "react-router-dom";
const MyProfile = () => {
  const navigate = useNavigate();
  const user = useUser(); 
  const [employee, setEmployee] = useState([]);
  const [activeTab, setActiveTab] = useState("personal");


  // Fetch employee data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/employee/profile/${user.id}`,
          { withCredentials: true }
        );
        setEmployee(response.data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    fetchData();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          borderBottom: "2px solid #ccc",
          marginBottom: "20px",
        }}
      >
        <button onClick={() => handleTabClick("personal")}>
          Personal Info
        </button>
        <button onClick={() => handleTabClick("basic")}>Basic Info</button>
        <button onClick={() => handleTabClick("appraisal")}>
          Appraisal Info
        </button>
      </div>

      

      {/* Tab Content */}
      <div>
        {activeTab === "personal" && <PersonalInfo employeedata={employee} user={user}/>}
        {activeTab === "basic" && <BasicInfo employeedata={employee} />}
        {activeTab === "appraisal" && <AppraisalInfo />}
      </div>
    </div>
  );
};
export default MyProfile;
