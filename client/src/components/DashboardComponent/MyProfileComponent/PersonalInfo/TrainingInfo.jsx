import { useState, useEffect } from "react";
import axios from "axios";

const TrainingInfo = ({ employeedata }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [trainingRows, setTrainingRows] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (employeedata?.candidate) {
      const candidateId = employeedata.candidate.candidate_id;
      const onCandidateId = candidateId;

      let parsedTraining = [];
      const rawTraining = employeedata.candidate.training;

      if (typeof rawTraining === "string") {
        try {
          parsedTraining = JSON.parse(rawTraining);
        } catch (err) {
          console.warn("Failed to parse education JSON:", err);
        }
      } else if (Array.isArray(rawTraining)) {
        parsedTraining = rawTraining;
      }

      setTrainingRows([...parsedTraining]);
      setFormData({
        ...employeedata.candidate,
        on_candidate_id: onCandidateId,
        updated_by: "hr-emp",
      });
    }
  }, [employeedata]);

  const handleEditClick = () => setIsEditing(true);

  const handleCancelClick = () => {
    setIsEditing(false);
    setTrainingRows([...(employeedata?.candidate?.training_info || [])]);
    const candidateId = employeedata?.candidate?.candidate_id;
    const onCandidateId = candidateId;

    let parsedTraining = [];
    const rawTraining = employeedata.candidate.training;

    if (typeof rawTraining === "string") {
      try {
        parsedTraining = JSON.parse(rawTraining);
      } catch (err) {
        console.warn("Failed to parse education JSON:", err);
      }
    } else if (Array.isArray(rawTraining)) {
      parsedTraining = rawTraining;
    }

    setTrainingRows([...parsedTraining]);

    setFormData({
      ...employeedata.candidate,
      on_candidate_id: onCandidateId,
      updated_by: "hr-emp",
    });
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
    console.log("my form data is >>", {
      ...formData,
      training_info: trainingRows,
    });
    if (!formData.on_candidate_id) {
      alert("Candidate ID is missing. Please contact support.");
      return;
    }
    try {
      const filteredFormData = {
        section: "training",
        training_info: trainingRows,
        on_candidate_id: formData.on_candidate_id,
        updated_by: formData.updated_by || "hr-emp",
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/joining-form-submit`,
        filteredFormData,
        { withCredentials: true }
      );

      if (response.data.status === 200) {
        console.log("Training info updated successfully:", response.data);
        setIsEditing(false);
      } else {
        console.warn("Submission failed:", response.data);
        alert(response.data.message || "Failed to update training info.");
      }
    } catch (error) {
      console.error("Error submitting training info:", error);
      alert(
        error.response?.data?.message || "An error occurred. Please try again."
      );
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
