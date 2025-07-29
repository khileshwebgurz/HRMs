import React, { useState, useEffect } from "react";
import axios from "axios";

const OtherSection = ({ employeedata }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (employeedata?.candidate) {
      const candidateId = employeedata.candidate.candidate_id;
      const onCandidateId = candidateId;
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
    const candidateId = employeedata?.candidate?.candidate_id;
    const onCandidateId = candidateId;
    setFormData({
      ...employeedata.candidate,
      on_candidate_id: onCandidateId,
      updated_by: "hr-emp",
    });
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (e) => {
    setFormData((prev) => ({ ...prev, marital_status: e.target.value }));
  };

 const handleSubmit = async () => {
    console.log("my form data is >>", formData);
    if (!formData.on_candidate_id) {
      alert("Candidate ID is missing. Please contact support.");
      return;
    }
    try {
      const filteredFormData = {
        section: "other",
        marital_status: formData.marital_status || "",
        spouse_name_profession: formData.spouse_name_profession || "",
        no_of_children: formData.no_of_children || "",
        father_name: formData.father_name || "",
        father_profession: formData.father_profession || "",
        father_age: formData.father_age || "",
        mother_name: formData.mother_name || "",
        mother_profession: formData.mother_profession || "",
        mother_age: formData.mother_age || "",
        on_candidate_id: formData.on_candidate_id,
        updated_by: formData.updated_by || "hr-emp",
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/joining-form-submit`,
        filteredFormData,
        { withCredentials: true }
      );

      if (response.data.status === 200) {
        console.log("Other info updated successfully:", response.data);
        setIsEditing(false);
      } else {
        console.warn("Update failed:", response.data);
        alert(response.data.message || "Failed to update other info.");
      }
    } catch (error) {
      console.error("Error submitting other info:", error);
      alert(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };
  return (
    <>
      <div className="card wgz-otherinfo">
        <div className="card-header">
          <h3 className="card-title form-header">Other info</h3>
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
                className="btn btn-info btn-xs mr-1"
                onClick={handleCancelClick}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
              <button className="btn btn-success btn-xs" onClick={handleSubmit}>
                <i className="fas fa-check"></i> Update
              </button>
            </div>
          )}
        </div>

        <div className="card-body">
          <div className="row">
            {/* Marital Status */}
            <div className="col-sm-6 col-md-4">
              <div className="form-group">
                <label className="col-form-label">Marital Status</label>
                {isEditing ? (
                  <div className="wgz_field">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="marital_status"
                        value="1"
                        checked={formData.marital_status === "1"}
                        onChange={handleRadioChange}
                      />
                      <label className="form-check-label">Single</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="marital_status"
                        value="2"
                        checked={formData.marital_status === "2"}
                        onChange={handleRadioChange}
                      />
                      <label className="form-check-label">Married</label>
                    </div>
                  </div>
                ) : (
                  <div className="wgz_value">
                    {formData.marital_status === "1"
                      ? "Single"
                      : formData.marital_status === "2"
                      ? "Married"
                      : "N/A"}
                  </div>
                )}
              </div>
            </div>

            {/* Spouse, Children, Father, Mother Info */}
            {[
              ["spouse_name_profession", "Spouse's name and profession"],
              ["no_of_children", "No. of children"],
              ["father_name", "Father’s name"],
              ["father_profession", "Father’s profession"],
              ["father_age", "Father’s age"],
              ["mother_name", "Mother’s name"],
              ["mother_profession", "Mother’s profession"],
              ["mother_age", "Mother’s age"],
            ].map(([key, label]) => (
              <div className="col-sm-6 col-md-4" key={key}>
                <div className="form-group">
                  <label htmlFor={key} className="col-form-label">
                    {label}
                  </label>
                  {isEditing ? (
                    <input
                      className="form-control"
                      type="text"
                      id={key}
                      name={key}
                      value={formData[key] || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="wgz_value">{formData[key] || "—"}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default OtherSection;
