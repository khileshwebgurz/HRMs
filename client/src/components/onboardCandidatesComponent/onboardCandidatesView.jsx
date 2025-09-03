import React, { useState } from "react";
import "../../assets/css/OnboardCandidatesView.css";

function OnboardCandidatesView() {
  const [activeTab, setActiveTab] = useState("document");

  const tabs = [
    { id: "document", label: "Document Checklist" },
    { id: "agreement", label: "Agreement & Orientation" },
    { id: "ids", label: "IDs & Passwords" },
    { id: "team", label: "Team Introduction & Verification" },
    { id: "master", label: "Master File" },
  ];

  const SectionCard = ({ children }) => (
    <div className="section-card">{children}</div>
  );

  const ActionButton = ({ label, color = "blue" }) => (
    <button className={`action-btn ${color}`}>{label}</button>
  );

  return (
    <div className="onboard-container">
      <h2 className="onboard-title">Edit User Profile</h2>

      {/* Tabs */}
      <div className="onboard-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`onboard-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Document Checklist */}
      {activeTab === "document" && (
        <SectionCard>
          <h3 className="section-title">Employee Joining Form</h3>
          <div className="form-grid">
            <input type="text" placeholder="Name" className="input" />
            <input type="date" placeholder="Date of Joining" className="input" />
            <input type="text" placeholder="Job Title" className="input" />
            <select className="input">
              <option>Department</option>
            </select>
            <input type="text" placeholder="Blood Group" className="input" />
            <input type="text" placeholder="Location" className="input" />
            <input type="date" placeholder="Date of Birth" className="input" />
            <input type="text" placeholder="Nationality" className="input" />
            <input
              type="email"
              placeholder="Email"
              className="input full-width"
            />
          </div>

          <div className="checklist">
            {[
              "Photograph",
              "Pan Card",
              "Aadhar Card",
              "Experience Letter",
              "Academic Record",
              "Salary Slips",
              "Relieving Letter",
            ].map((label) => (
              <div key={label} className="checklist-item">
                <span>{label}</span>
                <ActionButton label="Upload" />
              </div>
            ))}
          </div>

          <div className="btn-wrapper">
            <ActionButton label="Update" color="green" />
          </div>
        </SectionCard>
      )}

      {/* Agreement & Orientation */}
      {activeTab === "agreement" && (
        <SectionCard>
          {[
            "Appointment Letter",
            "Letter of Understanding",
            "Job Agreement",
            "NDA",
            "HR & Leave Policy",
            "Orientation & Induction",
          ].map((item) => (
            <div key={item} className="checklist-item">
              <span>{item}</span>
              <div className="btn-group">
                <ActionButton label="Generate" color="indigo" />
                <ActionButton label="Upload" />
              </div>
            </div>
          ))}
          <div className="btn-wrapper">
            <ActionButton label="Update" color="green" />
          </div>
        </SectionCard>
      )}

      {/* IDs & Passwords */}
      {activeTab === "ids" && (
        <SectionCard>
          <div className="checklist-item">
            <span>Add in WhatsApp group</span>
            <ActionButton label="Add Note" color="gray" />
          </div>
          <div className="textarea-box">
            <span>Email all IDs & passwords</span>
            <textarea rows="4"></textarea>
          </div>
          <div className="btn-group wrap">
            <ActionButton label="Send Login Email" />
            <ActionButton label="Important Details Email" />
            <ActionButton label="Intro Email" />
            <ActionButton label="Welcome Email" />
          </div>
          <div className="btn-wrapper">
            <ActionButton label="Update" color="green" />
          </div>
        </SectionCard>
      )}

      {/* Team Introduction */}
      {activeTab === "team" && (
        <SectionCard>
          {[
            "Introduction with TL/Team",
            "Allocation of Asset",
            "Candidate Background Verification",
            "Tier 1 Verification",
            "Tier 2 Verification",
            "Address Verification",
          ].map((item) => (
            <div key={item} className="checklist-item">
              <span>{item}</span>
              <ActionButton label="Add Note" color="gray" />
            </div>
          ))}
          <div className="btn-wrapper">
            <ActionButton label="Update" color="green" />
          </div>
        </SectionCard>
      )}

      {/* Master File */}
      {activeTab === "master" && (
        <SectionCard>
          {[
            "Webguru Readiness Quiz",
            "Inform Bank for Salary Account",
            "Inform CA",
            "Scan all documents",
            "Understanding of Roles",
            "Issuance of ID Card",
            "Induction Feedback Form",
            "Employee ID Allocation",
          ].map((item) => (
            <div key={item} className="checklist-item">
              <span>{item}</span>
              <ActionButton label="Add Note" color="gray" />
            </div>
          ))}
          <div className="btn-wrapper">
            <ActionButton label="Update" color="green" />
          </div>
        </SectionCard>
      )}
    </div>
  );
}

export default OnboardCandidatesView;
