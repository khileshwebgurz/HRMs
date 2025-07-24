import React, { useState } from "react";

const EmploymentHistory = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [employmentRows, setEmploymentRows] = useState([]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleAddRow = () => {
    setEmploymentRows((prev) => [
      ...prev,
      {
        fromto: "",
        organisation: "",
        responsibilities: "",
        position: "",
        salary: "",
        reason: "",
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    setEmploymentRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...employmentRows];
    updatedRows[index][field] = value;
    setEmploymentRows(updatedRows);
  };
  return (
    <>
      <div className="card wgz-eh">
        <div className="card-header">
          <h3 className="card-title form-header">Employment History</h3>
          {!isEditing && (
            <div className="card-tools wgz_value">
              <a
                // href="javascript:void(0)"
                className="btn btn-tool wgz-edit-form"
                data-id="wgz-eh"
                onClick={handleEditClick}
              >
                {" "}
                <i className="fas fa-edit"></i>
              </a>
            </div>
          )}

          {isEditing && (
            <div className="card-tools wgz_field">
              <button
                type="button"
                className="btn btn-info btn-xs wgz-close-form mr-1"
                data-id="wgz-eh"
                onClick={handleCancelClick}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
              <a
                // href="javascript:void(0)"
                className="btn btn-success btn-xs wgz-submit mr-1"
                data-id="wgz-eh"
                onClick={() => setIsEditing(false)}
              >
                <i className="fas fa-check"></i> Update
              </a>{" "}
              <a
                className="btn btn-primary btn-xs add-employment"
                data-added="0"
                onClick={handleAddRow}
              >
                <i className="fas fa-plus"></i> Add Row
              </a>
            </div>
          )}
        </div>

        <div className="card-body table-responsive">
          <p>
            Please list your most recent employer first (attach additional pages
            if required)
          </p>
          <table className="table table-bordered " id="wgz_employment">
            <thead>
              <tr>
                <th width="6%">S No.</th>
                <th>From To</th>
                <th>ORGANISATION</th>
                <th>TITLE AND KEY RESPONSIBILITIES in Short</th>
                <th>REPORTING TO(POSITION)</th>
                <th>SALARY (PM) AND PERKS</th>
                <th>REASONS FOR LEAVING</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* these tables rows are to be shown when add row is clicked */}

              {employmentRows.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  {isEditing ? (
                    <>
                      <td>
                        <input
                          className="form-control"
                          type="text"
                          value={row.fromto}
                          onChange={(e) =>
                            handleInputChange(index, "fromto", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <textarea
                          className="form-control"
                          value={row.organisation}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "organisation",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <textarea
                          className="form-control"
                          value={row.responsibilities}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "responsibilities",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <textarea
                          className="form-control"
                          value={row.position}
                          onChange={(e) =>
                            handleInputChange(index, "position", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <textarea
                          className="form-control"
                          value={row.salary}
                          onChange={(e) =>
                            handleInputChange(index, "salary", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <textarea
                          className="form-control"
                          value={row.reason}
                          onChange={(e) =>
                            handleInputChange(index, "reason", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <a
                          className="btn btn-xs delete-record-employment"
                          onClick={() => handleDeleteRow(index)}
                        >
                          <i className="fas fa-trash"></i>
                        </a>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{row.fromto || "-"}</td>
                      <td>{row.organisation || "-"}</td>
                      <td>{row.responsibilities || "-"}</td>
                      <td>{row.position || "-"}</td>
                      <td>{row.salary || "-"}</td>
                      <td>{row.reason || "-"}</td>
                      <td>-</td>
                    </>
                  )}
                </tr>
              ))}
              {employmentRows.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center">
                    No employment history added.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default EmploymentHistory;
