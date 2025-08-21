import React from "react";
import { useState } from "react";
const OfficialUse = ({ assessmentData, setAssessmentData }) => {
  const interviewerLabels = {
    1: "Interviewer 1 -TL",
    2: "Interviewer 2 - PM",
    3: "Interviewer 3 - HR",
  };

  const criteria = [
    { key: "interviewer_name", label: "Interviewer Name", type: "text" },
    { key: "education", label: "Education", type: "number" },
    { key: "experince", label: "Experience", type: "number" },
    { key: "attitude", label: "Attitude", type: "number" },
    { key: "stability", label: "Stability", type: "number" },
    { key: "technical_skills", label: "Technical Skills", type: "number" },
    {
      key: "appearance_personality",
      label: "Appearance / Personality",
      type: "number",
    },
    { key: "skills", label: "Communication / Written Skills", type: "number" },
  ];


console.log('my interview assessment >>>',assessmentData)
const handleOfficialChange = (interviewerId, field, value) => {
    setAssessmentData((prev) => ({
      ...prev,
      [interviewerId]: {
        ...prev[interviewerId],
        [field]: value,
      },
    }));
  };

  return (
    <>
      <div className="card">
        <div className="card-header">For Official Use Only</div>
        <div className="card-body">
          <table className="table table-bordered" id="wgz_assessments">
            <thead>
              <tr>
                <th>
                  Interviewer's Assessment:
                  <br />
                  (Tick as appropriate) Out of max 5
                </th>
                {Object.entries(interviewerLabels).map(([id, label]) => (
                  <th key={id}>
                    {label}
                    <br />
                    (out of 5)
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {criteria.map((criterion) => (

                <tr key={criterion.key}>
                  
                  <td>{criterion.label}</td>
                  {Object.keys(interviewerLabels).map((id) => (
                    <td key={id}>
                      <input
                        className="form-control"
                        type={criterion.type}
                        min={criterion.type === "number" ? 0 : undefined}
                        max={criterion.type === "number" ? 5 : undefined}
                        step={criterion.type === "number" ? 0.5 : undefined}
                        value={assessmentData[id-1]?.[criterion.key] || ""}
                        onChange={(e) =>
                          handleOfficialChange(
                            id,
                            criterion.key,
                            e.target.value
                          )
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default OfficialUse;
