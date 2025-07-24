import { useState } from "react";

const EducationDetail = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [educationRows, setEducationRows] = useState([]);

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => {
    setIsEditing(false);
    // Optionally reset rows here if needed
  };

  const handleAddRow = () => {
    setEducationRows((prev) => [
      ...prev,
      {
        qualification: "",
        university: "",
        specialization: "",
        yop: "",
        grade: "",
      },
    ]);
  };
  const handleDeleteRow = (index) => {
    setEducationRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...educationRows];
    updatedRows[index][field] = value;
    setEducationRows(updatedRows);
  };
  return (
    <>
      <div className="card wgz-ed">
        <div className="card-header">
          <h3 className="card-title form-header">Education Details</h3>

          {!isEditing && (
            <div className="card-tools wgz_value">
              <a
                // href="javascript:void(0)"
                className="btn btn-tool wgz-edit-form"
                data-id="wgz-ed"
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
                data-id="wgz-ed"
                onClick={handleCancelClick}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
              <a
                // href="javascript:void(0)"
                className="btn btn-success btn-xs wgz-submit mr-1"
                data-id="wgz-ed"
                onClick={() => setIsEditing(false)}
              >
                <i className="fas fa-check"></i> Update
              </a>{" "}
              <a
                className="btn btn-primary btn-xs add-education"
                data-added="0"
                onClick={handleAddRow}
              >
                <i className="fas fa-plus"></i> Add Row
              </a>
            </div>
          )}
        </div>

        <div className="card-body  table-responsive">
          <table className="table table-bordered " id="wgz_edu_details">
            <thead>
              <tr>
                <th width="6%">S No.</th>
                <th>Qualification</th>
                <th>University/board</th>
                <th>Specialization</th>
                <th>Year of passing</th>
                <th>Grade /CGPA</th>
                <th width="5%">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* these need to be shown when add row is clicked */}
              {educationRows.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    No education records added.
                  </td>
                </tr>
              ) : (
                educationRows.map((row, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>

                    {isEditing ? (
                      <>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            value={row.qualification}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "qualification",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            value={row.university}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "university",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            value={row.specialization}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "specialization",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            value={row.yop}
                            onChange={(e) =>
                              handleInputChange(index, "yop", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            value={row.grade}
                            onChange={(e) =>
                              handleInputChange(index, "grade", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-xs delete-record-education"
                            onClick={() => handleDeleteRow(index)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{row.qualification || "-"}</td>
                        <td>{row.university || "-"}</td>
                        <td>{row.specialization || "-"}</td>
                        <td>{row.yop || "-"}</td>
                        <td>{row.grade || "-"}</td>
                        <td>-</td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default EducationDetail;
