import React from "react";

const TechnicalSkils = ({ technicalSkills, setTechnicalSkills }) => {
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
                value={technicalSkills}
                onChange={(e) => setTechnicalSkills(e.target.value)}
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
