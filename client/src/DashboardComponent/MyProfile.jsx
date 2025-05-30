import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import PersonalInfo from "./MyProfileComponent/PersonalInfo";
import BasicInfo from "./MyProfileComponent/BasicInfo";
import AppraisalInfo from "./MyProfileComponent/AppraisalInfo";

const MyProfile = () => {
  const user = useUser(); // Assuming useUser provides { id, ...otherProps }
  const [employee, setEmployee] = useState([]);
  const [activeTab, setActiveTab] = useState("personal");

  console.log('my user is >>>>',user)
  // Fetch employee data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/employee/profile/${user.id}`,
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
        {activeTab === "personal" && <PersonalInfo employeedata={employee} />}
        {activeTab === "basic" && <BasicInfo employeedata={employee} />}
        {activeTab === "appraisal" && <AppraisalInfo />}
      </div>
    </div>
  );
};
export default MyProfile;
