import { useState, useEffect } from "react";
import axios from "axios";

const EducationDetail = ({ employeedata }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [educationRows, setEducationRows] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (employeedata?.candidate) {
      const candidateId = employeedata.candidate.candidate_id;
      const onCandidateId = candidateId;

      let parsedEducation = [];

      // Check if education is a string (JSON) and parse it
      const rawEducation = employeedata.candidate.education;
      if (typeof rawEducation === "string") {
        try {
          parsedEducation = JSON.parse(rawEducation);
        } catch (err) {
          console.warn("Failed to parse education JSON:", err);
        }
      } else if (Array.isArray(rawEducation)) {
        parsedEducation = rawEducation;
      }

      setEducationRows([...parsedEducation]);

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
    setEducationRows([...(employeedata?.candidate?.education || [])]);
    const candidateId = employeedata?.candidate?.candidate_id;
    const onCandidateId = candidateId;

    let parsedEducation = [];
    const rawEducation = employeedata.candidate.education;
    if (typeof rawEducation === "string") {
      try {
        parsedEducation = JSON.parse(rawEducation);
      } catch (err) {
        console.warn("Failed to parse education JSON:", err);
      }
    } else if (Array.isArray(rawEducation)) {
      parsedEducation = rawEducation;
    }

    setEducationRows([...parsedEducation]);

    setFormData({
      ...employeedata.candidate,
      on_candidate_id: onCandidateId,
      updated_by: "hr-emp",
    });
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

  const handleSubmit = async () => {
    console.log("my form data is >>", {
      ...formData,
      education: educationRows,
    });
    if (!formData.on_candidate_id) {
      alert("Candidate ID is missing. Please contact support.");
      return;
    }
    try {
      const filteredFormData = {
        section: "education",
        education: educationRows,
        on_candidate_id: formData.on_candidate_id,
        updated_by: formData.updated_by || "hr-emp",
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/joining-form-submit`,
        filteredFormData,
        { withCredentials: true }
      );

      if (response.data.status === 200) {
        console.log("Education details submitted successfully:", response.data);
        setIsEditing(false);
      } else {
        console.warn("Submission failed:", response.data);
        alert(response.data.message || "Failed to update education details.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <>
      <div className="card wgz-ed">
        <div className="card-header">
          <h3 className="card-title form-header">Education Details</h3>

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
          <table className="table table-bordered" id="wgz_edu_details">
            <thead>
              <tr>
                <th>S No.</th>
                <th>Qualification</th>
                <th>University/board</th>
                <th>Specialization</th>
                <th>Year of passing</th>
                <th>Grade /CGPA</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
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
                            className="btn btn-xs btn-danger"
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
