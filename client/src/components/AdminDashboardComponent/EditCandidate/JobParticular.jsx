import React from "react";

const JobParticular = ({ candidateProfile, onChange }) => {
  const departments = [
    { id: "1", name: "Digital Marketing" },
    { id: "2", name: "Business Development" },
    { id: "3", name: "Mobile Development" },
    { id: "4", name: "Web Designing" },
    { id: "5", name: "HR" },
    { id: "6", name: "Admin" },
    { id: "7", name: "Quality" },
    { id: "8", name: "Web Development" },
    { id: "9", name: "Online Marketing" },
  ];
  return (
    <>
      <div className="card">
        <div className="card-header">Job Particulars</div>
        <div className="card-body">
          <div className="form-group row">
            <label htmlFor="position" className="col-2 col-form-label">
              Position Applied For<span className="req">*</span>
            </label>
            <div className="col-10">
              <input
                className="form-control"
                type="text"
                value={candidateProfile.position}
                onChange={(e) => onChange("position", e.target.value)}
                name="position"
                id="position"
                required
              />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="department" className="col-2 col-form-label">
              Department<span className="req">*</span>
            </label>
            <div className="col-10">
              <select
                className="form-control"
                name="department"
                value={candidateProfile.department}
                onChange={(e) => onChange("department", e.target.value)}
                required
              >
                <option value="">Select..</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobParticular;
