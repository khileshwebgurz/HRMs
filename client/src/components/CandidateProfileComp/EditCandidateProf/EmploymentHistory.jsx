import React from "react";

const EmploymentHistory = () => {
  return (
    <>
      <div className="card">
        <div className="card-header">
          Employment History <span className="req">*</span>
          <a
            className="btn btn-primary btn-sm float-right add-employment"
            data-added="0"
          >
            <i className="fas fa-plus"></i> Add Row
          </a>
        </div>
        <div className="card-body">
          <table className="table table-bordered " id="wgz_employment">
            <thead>
              <tr>
                <th>S No.</th>
                <th>Name of the Company / Address / Contact Details</th>
                <th>From</th>
                <th>To</th>
                <th>Position Held</th>
                <th>Reason for Leaving</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr id="rec-employment-{{$em}}">
                <td>
                  <span className="sn"></span>
                </td>
                <td>
                  Name of the Company{" "}
                  <textarea
                    className="form-control"
                    name="candidate_employments[company_name][]"
                  ></textarea>
                  Address{" "}
                  <textarea
                    className="form-control"
                    name="candidate_employments[address][]"
                  ></textarea>
                  Contact Details{" "}
                  <textarea
                    className="form-control"
                    name="candidate_employments[contact_details][]"
                  ></textarea>
                </td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    value="{{$employment->date_from}}"
                    name="candidate_employments[date_from][]"
                    autocomplete="nope"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    value="{{$employment->date_to}}"
                    name="candidate_employments[date_to][]"
                    autocomplete="nope"
                  />
                </td>
                <td>
                  <textarea
                    className="form-control"
                    name="candidate_employments[position][]"
                    rows="6"
                  ></textarea>
                </td>
                <td>
                  <textarea
                    className="form-control"
                    name="candidate_employments[reason_of_leaving][]"
                    rows="6"
                  ></textarea>
                </td>
                <td>
                  <a
                    className="btn btn-xs delete-record-employment"
                    data-id="{{$em}}"
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
                  Name of the Company{" "}
                  <textarea
                    className="form-control"
                    name="candidate_employments[company_name][]"
                  ></textarea>
                  Address{" "}
                  <textarea
                    className="form-control"
                    name="candidate_employments[address][]"
                  ></textarea>{" "}
                  Contact Details{" "}
                  <textarea
                    className="form-control"
                    name="candidate_employments[contact_details][]"
                  ></textarea>
                </td>
                <td>
                  <select
                    className="custom-select "
                    name="candidate_employments[date_from][]"
                  >
                    <option value="">From...</option>

                    <option value="{{$j}}"></option>
                  </select>
                </td>
                <td>
                  <select
                    className="custom-select"
                    name="candidate_employments[date_to][]"
                  >
                    <option value="">To...</option>

                    <option value="{{$k}}"></option>
                  </select>
                </td>
                <td>
                  <textarea
                    className="form-control"
                    name="candidate_employments[position][]"
                    rows="6"
                  ></textarea>
                </td>
                <td>
                  <select
                    className="custom-select"
                    name="candidate_employments[reason_of_leaving][]"
                  >
                    <option value="">Select Reason</option>
                    <option value="Growth Prospects">Growth Prospects</option>
                    <option value="Medical Issue">Medical Issue</option>
                    <option value="Family Issue">Family Issue</option>
                    <option value="Salary Issue">Salary Issue</option>
                    <option value="Employee Benefits">Employee Benefits</option>
                    <option value="Other">Other</option>
                  </select>
                </td>
                <td>
                  <a
                    className="btn btn-xs delete-record-employment"
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

export default EmploymentHistory;
