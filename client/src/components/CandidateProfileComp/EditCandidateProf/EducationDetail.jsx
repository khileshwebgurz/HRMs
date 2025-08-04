import React from "react";

const EducationDetail = () => {
  return (
    <>
      <div className="card">
        <div className="card-header">
          Education Details<span className="req">*</span>
          <a
            className="btn btn-primary btn-sm float-right add-education"
            data-added="0"
          >
            <i className="fas fa-plus"></i> Add Row
          </a>
        </div>
        <div className="card-body">
          <table className="table table-bordered " id="wgz_edu_details">
            <thead>
              <tr>
                <th width="2%">S No.</th>
                <th>
                  School / University / Professional Institute (Latest First)
                </th>
                <th width="10%">From</th>
                <th width="10%">To</th>
                <th>
                  Highest Standard Passed / Certificate / Degree / Professional
                  Qualifications
                </th>
                <th width="5%">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr id="rec-{{$ek}}">
                <td>
                  <span className="sn"></span>
                </td>
                <td>
                  <textarea
                    className="form-control"
                    rows="2"
                    name="candidate_education[institute_name][]"
                  ></textarea>
                </td>
                <td>
                  <select
                    className="custom-select"
                    name="candidate_education[from][]"
                  >
                    <option value="">From...</option>

                    <option value="{{$j}}"></option>
                  </select>
                </td>
                <td>
                  <select
                    className="custom-select"
                    name="candidate_education[to][]"
                  >
                    <option value="">To...</option>

                    <option value="{{$j}}"></option>
                  </select>
                </td>
                <td>
                  <textarea
                    className="form-control"
                    rows="2"
                    name="candidate_education[professional_qualification][]"
                  ></textarea>
                </td>
                <td>
                  <a
                    className="btn btn-xs delete-record"
                    style={{ display: "none" }}
                    data-id="<?php echo $ek; ?>"
                  >
                    <i className="fas fa-trash"></i>
                  </a>
                </td>
              </tr>

              <tr>
                <td>
                  <span className="sn">1</span>
                </td>
                <td>
                  <textarea
                    className="form-control"
                    rows="2"
                    name="candidate_education[institute_name][]"
                  ></textarea>
                </td>
                <td>
                  <select
                    className="custom-select education_from"
                    name="candidate_education[from][]"
                  >
                    <option value="">From...</option>

                    <option value="{{$j}}"></option>
                  </select>
                </td>
                <td>
                  <select
                    className="custom-select education_to"
                    name="candidate_education[to][]"
                  >
                    <option value="">To...</option>

                    <option value="{{$j}}"></option>
                  </select>
                </td>
                <td>
                  <textarea
                    className="form-control"
                    rows="2"
                    name="candidate_education[professional_qualification][]"
                  ></textarea>
                </td>
                <td>
                  <a
                    className="btn btn-xs delete-record"
                    style={{ display: "none" }}
                    data-id="0"
                  >
                    <i className="fas fa-trash"></i>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default EducationDetail;
