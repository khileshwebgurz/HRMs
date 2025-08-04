import React from "react";

const TechnicalSkils = ({ technicalSkills, setTechnicalSkills }) => {
  console.log("my technical skills are >>>", technicalSkills);
  return (
    <>
      <div className="card">
        <div className="card-header">
          Technical Skills<span className="req">*</span>
        </div>
        <div className="card-body">
          <div className="form-group row">
            <div className="col-12">
              <input
                className="form-control"
                type="text"
                name="skill_name"
                value={
                  Array.isArray(technicalSkills)
                    ? technicalSkills
                        .map((skill) => skill.skill_name)
                        .join(", ")
                    : technicalSkills
                }
                onChange={(e) => {
                  // Store as comma-separated string
                  setTechnicalSkills(e.target.value);
                }}
                id="wgz_skills"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TechnicalSkils;
