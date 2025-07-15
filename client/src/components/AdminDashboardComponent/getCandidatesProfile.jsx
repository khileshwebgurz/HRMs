import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import JobParticular from "../CandidateProfileComp/JobParticular";
import History from "../CandidateProfileComp/History";

const CandidateProfile = () => {
  const { profile_id } = useParams();

  const [candidateData, setCandidateData] = useState([]);
  const [activeTab, setActiveTab] = useState("information");

  const fetchCandidateProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/candidate/profile/${profile_id}`,
        { withCredentials: true }
      );
    
      setCandidateData(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  useEffect(() => {
    fetchCandidateProfile();
  }, [profile_id]);

  if (!candidateData) return <p>Loading...</p>;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };



  return (
    <>
      <div className="card card-primary card-outline card-outline-tabs">
        <div className="card-header p-0 border-bottom-0">
          <ul className="nav nav-tabs" id="custom-tabs-four-tab" role="tablist">
            <li className="nav-item">
              <button
                className="nav-link active"
                id="custom-tabs-four-home-tab"
                data-toggle="pill"
                onClick={() => handleTabChange("information")}
                role="tab"
                aria-controls="custom-tabs-four-home"
                aria-selected="true"
              >
                Information
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link"
                id="custom-tabs-four-profile-tab"
                data-toggle="pill"
                onClick={() => handleTabChange("history")}
                role="tab"
                aria-controls="custom-tabs-four-profile"
                aria-selected="false"
              >
                History
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {/* 	<div className="tab-content" id="custom-tabs-four-tabContent"> */}
          <div id="custom-tabs-four-tabContent">
            {activeTab === "information" && (
              <JobParticular data={candidateData} />
            )}
            {activeTab === "history" && <History />}
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidateProfile;
