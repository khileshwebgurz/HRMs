import React from "react";

const UploadCV = () => {
  return (
    <>
      <div className="card">
        <div className="card-header">Upload CV</div>
        <div className="card-body">
          <div className="form-group row">
            <div className="col-12">
              <input
                className="form-control"
                type="file"
                name="upload_cv"
                value=""
                id="upload_cv"
              />
              <div id="cv_file_div" style={{ padding: "10px 0" }}>
                <a
                  href="{{ asset('/uploads/cv/'.$candidate->cv_file) }}"
                  target="_blank"
                >
                  {" "}
                  &nbsp;{" "}
                  <i className="fas fa-download" style={{ color: "green" }}></i>
                </a>
              </div>
              <input
                className="form-control"
                type="hidden"
                name="upload_cv_remove"
                value=""
                id="upload_cv_remove"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadCV;
