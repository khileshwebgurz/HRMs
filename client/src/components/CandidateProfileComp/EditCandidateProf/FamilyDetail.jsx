import React from "react";

const FamilyDetail = () => {
  return (
    <>
      <div className="card">
        <div className="card-header">
          FAMILY DETAILS<span className="req">*</span>{" "}
          <a
            className="btn btn-primary btn-sm float-right add-family"
            data-added="0"
          >
            <i className="fas fa-plus"></i> Add Row
          </a>
        </div>
        <div className="card-body">
          <table className="table table-bordered " id="wgz_family">
            <thead>
              <tr>
                <th width="2%">S No.</th>
                <th width="10%">NAME</th>
                <th width="10%">RELATIONSHIP</th>
                <th width="5%">AGE</th>
                <th width="10%">OCCUPATION</th>
                <th width="10%">NAME OF EMPLOYER</th>
                <th width="5%">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr id="rec-family-{{$fa}}">
                <td>
                  <span className="sn"></span>
                </td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    value="{{$family->name}}"
                    name="candidate_families[name][]"
                  />
                </td>
                <td>
                  <select
                    className="custom-select"
                    name="candidate_families[relationship][]"
                  >
                    <option value="">Relationship</option>

                    <option value="{{$rk}}"></option>
                  </select>
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    name="candidate_families[age][]"
                    min="0"
                    step="1"
                    value="{{$family->age}}"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    name="candidate_families[occupation][]"
                    value="{{$family->occupation}}"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    value="{{$family->name_of_employer}}"
                    name="candidate_families[name_of_employer][]"
                  />
                </td>
                <td>
                  <a
                    className="btn btn-xs delete-record-family"
                    data-id="{{$fa}}"
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
                  <input
                    className="form-control"
                    type="text"
                    value=""
                    name="candidate_families[name][]"
                  />
                </td>
                <td>
                  <select
                    className="custom-select"
                    name="candidate_families[relationship][]"
                  >
                    <option value="">Relationship</option>

                    <option value="{{$rk}}"></option>
                  </select>
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    name="candidate_families[age][]"
                    min="0"
                    step="1"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="search"
                    name="candidate_families[occupation][]"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="search"
                    name="candidate_families[name_of_employer][]"
                  />
                </td>
                <td>
                  <a
                    className="btn btn-xs delete-record-family"
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

export default FamilyDetail;
