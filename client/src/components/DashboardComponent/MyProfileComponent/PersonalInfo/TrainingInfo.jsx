import { useState } from "react";

const TrainingInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [trainingRows, setTrainingRows] = useState([]);

  const handleEditClick = () => setIsEditing(true);

  const handleCancelClick = () => {
    setIsEditing(false);
    // Optionally reset rows here if needed
  };

  const handleAddRow = () => {
    setTrainingRows((prev) => [
      ...prev,
      {
        course: "",
        location: "",
        conductedby: "",
        month: "",
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    setTrainingRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...trainingRows];
    updatedRows[index][field] = value;
    setTrainingRows(updatedRows);
  };
  return (
    <>
      <div className="card wgz-tranind">
        <div className="card-header">
          <h3 className="card-title form-header">Traning</h3>

          {!isEditing && (
            <div className="card-tools wgz_value">
              <a
                // href="javascript:void(0)"
                className="btn btn-tool wgz-edit-form"
                data-id="wgz-tranind"
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
                data-id="wgz-tranind"
                onClick={handleCancelClick}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
              <a
                // href="javascript:void(0)"
                className="btn btn-success btn-xs wgz-submit mr-1"
                data-id="wgz-tranind"
                onClick={() => setIsEditing(false)}
              >
                {" "}
                <i className="fas fa-check"></i> Update
              </a>{" "}
              <a
                className="btn btn-primary btn-xs add-language"
                onClick={handleAddRow}
                data-added="0"
              >
                <i className="fas fa-plus"></i> Add Row
              </a>
            </div>
          )}
        </div>
        <div className="card-body  table-responsive">
          <table className="table table-bordered " id="wgz_language">
            <thead>
              <tr>
                <th width="2%">S No.</th>
                <th width="10%">Course module</th>
                <th width="10%">Location</th>
                <th width="10%">Conducted by</th>
                <th width="10%">Month/year</th>
                <th width="5%">Action</th>
              </tr>
            </thead>
            <tbody>
              {trainingRows.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No training records added.
                  </td>
                </tr>
              ) : (
                trainingRows.map((row, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>

                    {isEditing ? (
                      <>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            value={row.course}
                            onChange={(e) =>
                              handleInputChange(index, "course", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            value={row.location}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "location",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            value={row.conductedby}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "conductedby",
                                e.target.value
                              )
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
                            className="btn btn-xs delete-record-training"
                            onClick={() => handleDeleteRow(index)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{row.course || "-"}</td>
                        <td>{row.location || "-"}</td>
                        <td>{row.conductedby || "-"}</td>
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

export default TrainingInfo;
