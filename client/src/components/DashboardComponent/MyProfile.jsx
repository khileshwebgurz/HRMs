import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import PersonalInfo from "./MyProfileComponent/PersonalInfo";
import BasicInfo from "./MyProfileComponent/BasicInfo";
import AppraisalInfo from "./MyProfileComponent/AppraisalInfo";
import ProfilePic from "../DashboardComponent/MyProfileComponent/PersonalInfo/ProfilePic";

const MyProfile = ({path}) => {
  const user = useUser(); 
  const [employee, setEmployee] = useState([]);
  const [activeTab, setActiveTab] = useState("personal");

  const ID = path ? path : user.id;
// candidate_id

  // Fetch employee data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/employee/profile/${ID}`,
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
    <div className="my-profile-main mt-4">
      {/* Tab Navigation */}
    <div className="container">
      <div className="card card-primary card-sec">
       <div class="card-header">
				<h3 class="card-title">Personal Information</h3>
			</div>
      <div className="profile-top">
        <ProfilePic employeedata={employee}/>
      </div>
      <div className="container-fluid">
        <div className="tab-navigation">
           <button className={activeTab === "personal" ? "active" : ""} onClick={() => handleTabClick("personal")}>Personal Info</button>
           <button className={activeTab === "basic" ? "active" : ""} onClick={() => handleTabClick("basic")}>Basic Info</button>
           <button className={activeTab === "appraisal" ? "active" : ""} onClick={() => handleTabClick("appraisal")}>Appraisal Info</button>
       </div>
      </div>

      {/* Tab Content */}
      <div className="profile-tab-content">
        {activeTab === "personal" && <PersonalInfo employeedata={employee}/>}
        {activeTab === "basic" && <BasicInfo employeedata={employee} />}
        {activeTab === "appraisal" && <AppraisalInfo employeedata={employee} />}
      </div>
     </div>


     </div>
    </div>
  );
};
export default MyProfile;
