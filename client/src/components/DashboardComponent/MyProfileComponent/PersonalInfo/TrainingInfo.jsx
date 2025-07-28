import { useState, useEffect } from "react";
import axios from "axios";

const TrainingInfo = ({ employeedata }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [trainingRows, setTrainingRows] = useState([]);

  useEffect(() => {
    if (employeedata?.candidate?.training_info?.length > 0) {
      setTrainingRows([...employeedata.candidate.training_info]);
    }
  }, [employeedata]);

  const handleEditClick = () => setIsEditing(true);

  const handleCancelClick = () => {
    setIsEditing(false);
    setTrainingRows([...(employeedata?.candidate?.training_info || [])]);
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

  const handleSubmit = async () => {
    try {
      const payload = {
        ...employeedata.candidate,
        training_info: trainingRows,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/joining-form-submit`,
        payload,
        { withCredentials: true }
      );

      if (response.data.status === 200) {
        console.log("Training info updated successfully");
        setIsEditing(false);
      } else {
        console.warn("Failed to submit training info");
      }
    } catch (error) {
      console.error("Error submitting training info:", error);
    }
  };

  return (
    <>
      <div className="card wgz-tranind">
        <div className="card-header">
          <h3 className="card-title form-header">Training</h3>

          {!isEditing ? (
            <div className="card-tools wgz_value">
              <button
                className="btn btn-tool wgz-edit-form"
                onClick={handleEditClick}
              >
                <i className="fas fa-edit"></i>
              </button>
            </div>
          ) : (
            <div className="card-tools wgz_field">
              <button
                type="button"
                className="btn btn-info btn-xs mr-1"
                onClick={handleCancelClick}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
              <button
                className="btn btn-success btn-xs mr-1"
                onClick={handleSubmit}
              >
                <i className="fas fa-check"></i> Update
              </button>
              <button className="btn btn-primary btn-xs" onClick={handleAddRow}>
                <i className="fas fa-plus"></i> Add Row
              </button>
            </div>
          )}
        </div>

        <div className="card-body table-responsive">
          <table className="table table-bordered" id="wgz_language">
            <thead>
              <tr>
                <th>S No.</th>
                <th>Course module</th>
                <th>Location</th>
                <th>Conducted by</th>
                <th>Month/year</th>
                <th>Action</th>
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
                            className="btn btn-xs btn-danger"
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
