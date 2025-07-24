import { useState } from "react";

const AcademicCertification = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [academicRows, setAcademicRows] = useState([]);

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => {
    setIsEditing(false);
   
  };

  const handleAddRow = () => {
    setAcademicRows((prev) => [
      ...prev,
      {
        name: "",
        board: "",
        month: "",
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    setAcademicRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...academicRows];
    updatedRows[index][field] = value;
    setAcademicRows(updatedRows);
  };
  return (
    <>
      <div className="card wgz-certi">
        <div className="card-header">
          <h3 className="card-title form-header">
            CERTIFICATION[S] (Academic or Extra-Curricular)
          </h3>
          {!isEditing && (
            <div className="card-tools wgz_value">
              <a
                // href="javascript:void(0)"
                className="btn btn-tool wgz-edit-form"
                data-id="wgz-certi"
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
                data-id="wgz-certi"
                onClick={handleCancelClick}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
              <a
                // href="javascript:void(0)"
                className="btn btn-success btn-xs wgz-submit mr-1"
                data-id="wgz-certi"
                onClick={() => setIsEditing(false)}
              >
                {" "}
                <i className="fas fa-check"></i> Update
              </a>{" "}
              <a
                className="btn btn-primary btn-xs add-family"
                onClick={handleAddRow}
                data-added="0"
              >
                <i className="fas fa-plus"></i> Add Row
              </a>
            </div>
          )}
        </div>

        <div className="card-body  table-responsive">
          <table className="table table-bordered " id="wgz_family">
            <thead>
              <tr>
                <th width="2%">S No.</th>
                <th width="10%">Name</th>
                <th width="10%">Board/society</th>
                <th width="10%">Month/year</th>
                <th width="5%">Action</th>
              </tr>
            </thead>
            <tbody>
              {academicRows.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No certification records added.
                  </td>
                </tr>
              ) : (
                academicRows.map((row, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>

                    {isEditing ? (
                      <>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            value={row.name}
                            onChange={(e) =>
                              handleInputChange(index, "name", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            value={row.board}
                            onChange={(e) =>
                              handleInputChange(index, "board", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            value={row.month}
                            onChange={(e) =>
                              handleInputChange(index, "month", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-xs delete-record-certification"
                            onClick={() => handleDeleteRow(index)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{row.name || "-"}</td>
                        <td>{row.board || "-"}</td>
                        <td>{row.month || "-"}</td>
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

export default AcademicCertification;
