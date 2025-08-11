import React, { useState, useEffect } from "react";
import axios from "axios";

const EmploymentHistory = ({ employeedata }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [employmentRows, setEmploymentRows] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({ employment_history: [] });

  useEffect(() => {
    if (employeedata?.candidate) {
      const candidateId = employeedata.candidate.candidate_id;
      const onCandidateId = candidateId;

      let parsedEmployment = [];
      const rawEmployment = employeedata.candidate.employment_history;
      if (typeof rawEmployment === "string") {
        try {
          parsedEmployment = JSON.parse(rawEmployment);
        } catch (err) {
          console.warn("Failed to parse employment JSON:", err);
        }
      } else if (Array.isArray(rawEmployment)) {
        parsedEmployment = rawEmployment;
      }

      setEmploymentRows([...parsedEmployment]);

      setFormData({
        ...employeedata.candidate,
        on_candidate_id: onCandidateId,
        updated_by: "hr-emp",
      });
    }
  }, [employeedata]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setErrors({ employment_history: [] });

    let parsedEmployment = [];
    const rawEmployment = employeedata.candidate.employment_history;
    if (typeof rawEmployment === "string") {
      try {
        parsedEmployment = JSON.parse(rawEmployment);
      } catch (err) {
        console.warn("Failed to parse employment JSON:", err);
      }
    } else if (Array.isArray(rawEmployment)) {
      parsedEmployment = rawEmployment;
    }

    setEmploymentRows([...parsedEmployment]);
    setFormData({
      ...employeedata.candidate,
      on_candidate_id: employeedata?.candidate?.candidate_id,
      updated_by: "hr-emp",
    });
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
    setErrors((prev) => ({
      ...prev,
      employment_history: [...prev.employment_history, {}],
    }));
  };

  const handleDeleteRow = (index) => {
    setEmploymentRows((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => ({
      ...prev,
      employment_history: prev.employment_history.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...employmentRows];
    updatedRows[index][field] = value;
    setEmploymentRows(updatedRows);
  };

  const validateEmploymentInfo = (rows) => {
    const errors = { employment_history: [] };

    if (!Array.isArray(rows) || rows.length === 0) {
      errors.general = "Employment history is required.";
      return errors;
    }

    rows.forEach((row) => {
      const rowErrors = {};

      if (row.fromto && row.fromto.length > 255) {
        rowErrors.fromto = "From-To must be at most 255 characters.";
      }

      if (row.organisation && row.organisation.length > 255) {
        rowErrors.organisation = "Organisation must be at most 255 characters.";
      }

      if (row.responsibilities && row.responsibilities.length > 1000) {
        rowErrors.responsibilities =
          "Responsibilities must be at most 1000 characters.";
      }

      if (row.position && row.position.length > 255) {
        rowErrors.position = "Position must be at most 255 characters.";
      }

      if (row.salary && row.salary.length > 255) {
        rowErrors.salary = "Salary must be at most 255 characters.";
      }

      if (row.reason && row.reason.length > 1000) {
        rowErrors.reason = "Reason must be at most 1000 characters.";
      }

      errors.employment_history.push(rowErrors);
    });

    return errors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateEmploymentInfo(employmentRows);
    const hasErrors = validationErrors.general ||
      validationErrors.employment_history.some(
        (row) => Object.keys(row).length > 0
      );

    if (hasErrors) {
      setErrors(validationErrors);
      return;
    }

    setErrors({ employment_history: [] });

    if (!formData.on_candidate_id) {
      alert("Candidate ID is missing. Please contact support.");
      return;
    }
    try {
      const filteredFormData = {
        section: "employment",
        employment_history: employmentRows,
        on_candidate_id: formData.on_candidate_id,
        updated_by: formData.updated_by || "hr-emp",
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/joining-form-submit`,
        filteredFormData,
        { withCredentials: true }
      );

      if (response.data.status === 200) {
        console.log("Employment history updated successfully:", response.data);
        setIsEditing(false);
      } else {
        console.warn("Submission failed:", response.data);
        alert(response.data.message || "Failed to update employment history.");
      }
    } catch (error) {
      console.error("Error submitting employment history:", error);
      alert(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <>
      <div className="card wgz-eh">
        <div className="card-header">
          <h3 className="card-title form-header">Employment History</h3>
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
          <p>
            Please list your most recent employer first (attach additional pages if required)
          </p>
          {errors.general && (
            <div className="text-danger mb-2">{errors.general}</div>
          )}
          <table className="table table-bordered" id="wgz_employment">
            <thead>
              <tr>
                <th>S No.</th>
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
              {employmentRows.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    No employment history added.
                  </td>
                </tr>
              ) : (
                employmentRows.map((row, index) => (
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
                          {errors.employment_history[index]?.fromto && (
                            <div className="text-danger small">
                              {errors.employment_history[index].fromto}
                            </div>
                          )}
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
                          {errors.employment_history[index]?.organisation && (
                            <div className="text-danger small">
                              {errors.employment_history[index].organisation}
                            </div>
                          )}
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
                          {errors.employment_history[index]?.responsibilities && (
                            <div className="text-danger small">
                              {errors.employment_history[index].responsibilities}
                            </div>
                          )}
                        </td>
                        <td>
                          <textarea
                            className="form-control"
                            value={row.position}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "position",
                                e.target.value
                              )
                            }
                          />
                          {errors.employment_history[index]?.position && (
                            <div className="text-danger small">
                              {errors.employment_history[index].position}
                            </div>
                          )}
                        </td>
                        <td>
                          <textarea
                            className="form-control"
                            value={row.salary}
                            onChange={(e) =>
                              handleInputChange(index, "salary", e.target.value)
                            }
                          />
                          {errors.employment_history[index]?.salary && (
                            <div className="text-danger small">
                              {errors.employment_history[index].salary}
                            </div>
                          )}
                        </td>
                        <td>
                          <textarea
                            className="form-control"
                            value={row.reason}
                            onChange={(e) =>
                              handleInputChange(index, "reason", e.target.value)
                            }
                          />
                          {errors.employment_history[index]?.reason && (
                            <div className="text-danger small">
                              {errors.employment_history[index].reason}
                            </div>
                          )}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default EmploymentHistory;
