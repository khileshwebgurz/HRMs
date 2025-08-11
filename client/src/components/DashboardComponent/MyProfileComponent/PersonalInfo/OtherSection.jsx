import React, { useState, useEffect } from "react";
import axios from "axios";

const OtherSection = ({ employeedata }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

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

  const validateContactInfo = (data) => {
    const errors = {};

    // Marital Status: nullable | in:1,2
    if (data.marital_status && !["1", "2"].includes(data.marital_status)) {
      errors.marital_status = "Marital status must be Single or Married.";
    }

    // Spouse Name Profession: nullable | string | max:255
    if (
      data.spouse_name_profession &&
      data.spouse_name_profession.length > 255
    ) {
      errors.spouse_name_profession =
        "Spouse name/profession must be at most 255 characters.";
    }

    // No of children: nullable | integer | min:0
    if (
      data.no_of_children &&
      (!/^\d+$/.test(data.no_of_children) || parseInt(data.no_of_children) < 0)
    ) {
      errors.no_of_children = "Number of children must be a positive integer.";
    }

    // Father name: nullable | string | max:255
    if (data.father_name && data.father_name.length > 255) {
      errors.father_name = "Father's name must be at most 255 characters.";
    }

    // Father profession: nullable | string | max:255
    if (data.father_profession && data.father_profession.length > 255) {
      errors.father_profession =
        "Father's profession must be at most 255 characters.";
    }

    // Father age: nullable | integer | min:0
    if (
      data.father_age &&
      (!/^\d+$/.test(data.father_age) || parseInt(data.father_age) < 0)
    ) {
      errors.father_age = "Father's age must be a positive integer.";
    }

    // Mother name: nullable | string | max:255
    if (data.mother_name && data.mother_name.length > 255) {
      errors.mother_name = "Mother's name must be at most 255 characters.";
    }

    // Mother profession: nullable | string | max:255
    if (data.mother_profession && data.mother_profession.length > 255) {
      errors.mother_profession =
        "Mother's profession must be at most 255 characters.";
    }

    // Mother age: nullable | integer | min:0
    if (
      data.mother_age &&
      (!/^\d+$/.test(data.mother_age) || parseInt(data.mother_age) < 0)
    ) {
      errors.mother_age = "Mother's age must be a positive integer.";
    }

    // Date of marriage anniversary: nullable | date
    if (
      data.date_of_marriage_anniversary &&
      isNaN(Date.parse(data.date_of_marriage_anniversary))
    ) {
      errors.date_of_marriage_anniversary = "Invalid date format.";
    }

    return errors;
  };

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
    const validationErrors = validateContactInfo(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
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
      alert(
        error.response?.data?.message || "An error occurred. Please try again."
      );
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
                    {errors.marital_status && (
                      <div className="text-danger small">
                        {errors.marital_status}
                      </div>
                    )}
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
                  {isEditing && errors[key] && (
                    <div className="text-danger small">{errors[key]}</div>
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
