import React from "react";

const TechnicalSkils = ({ technicalSkills, setTechnicalSkills }) => {
  
  return (
    <>
      <div className="card">
        <div className="card-header">
          Technical Skills
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
