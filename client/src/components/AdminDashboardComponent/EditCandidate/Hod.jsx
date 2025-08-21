import { Link } from "react-router-dom";

const Hod = ({ recommendation, setRecommendation }) => {
  const handleHODChange = (e) => {
    const { name, value } = e.target;
    setRecommendation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="card">
        <div className="card-header">Head of Department's Recommendation</div>
        <div className="card-body">
          {/* Status */}
          <div className="form-group row">
            <label htmlFor="status" className="col-2 col-form-label">
              Status <span className="req">*</span>
            </label>
            <div className="col-10">
              <select
                className="custom-select"
                id="status"
                name="status"
                value={recommendation.status}
                onChange={handleHODChange}
                required
              >
                <option value="">Choose...</option>
                <option value="1">Approved</option>
                <option value="2">Rejected</option>
                <option value="3">On Hold</option>
              </select>
            </div>
          </div>

          {/* Remarks */}
          <div className="form-group row">
            <label htmlFor="remarks" className="col-2 col-form-label">
              Remarks
            </label>
            <div className="col-10">
              <textarea
                id="remarks"
                className="form-control"
                name="remarks"
                rows="5"
                value={recommendation.remarks}
                onChange={handleHODChange}
              ></textarea>
            </div>
          </div>

          {/* 3-column row */}
          <div className="row">
            {[
              { label: "Sourcing", name: "sourcing", type: "text" },
              {
                label: "Date of Interview",
                name: "date_of_interview",
                type: "date",
              },
              { label: "Interviewed By", name: "interviewed_by", type: "text" },
            ].map((field, i) => (
              <div className="col-lg-4" key={i}>
                <div className="form-group row">
                  <label htmlFor={field.name} className="col-4 col-form-label">
                    {field.label}
                  </label>
                  <div className="col-8">
                    <input
                      className="form-control"
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      value={recommendation[field.name]}
                      onChange={handleHODChange}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Second 3-column row */}
          <div className="row">
            {[
              {
                label: "Interview Score",
                name: "interview_score",
                type: "number",
              },
              { label: "Current Salary", name: "current_salary", type: "text" },
              {
                label: "Expected Salary",
                name: "expected_salary",
                type: "text",
              },
              {
                label: "Offered Salary",
                name: "offered_salary",
                type: "text",
              },
            ].map((field, i) => (
              <div className="col-lg-4" key={i}>
                <div className="form-group row">
                  <label htmlFor={field.name} className="col-4 col-form-label">
                    {field.label}
                  </label>
                  <div className="col-8">
                    <input
                      className="form-control"
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      value={recommendation[field.name] || []}
                      onChange={handleHODChange}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="form-group row">
            <label htmlFor="upload_cv" className="col-md-4 col-form-label">
              Upload CV
            </label>
            <div className="col-md-8">
              <input
                className="form-control"
                type="file"
                name="upload_cv"
                id="upload_cv"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  setRecommendation((prev) => ({
                    ...prev,
                    upload_cv: e.target.files[0], 
                  }))
                }
              />
            </div>
            {recommendation?.cv_file && (
              <div style={{ marginTop: "10px" }}>
                <Link target="_blank" to={`${import.meta.env.VITE_API_IMAGE_URL}/uploads/cv/${recommendation.cv_file}`}>
                  {recommendation?.cv_file}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Hod;
