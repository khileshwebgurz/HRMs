import { useState, useEffect } from "react";
import axios from "axios";

const PersonalInfoSection = ({ employeedata }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const departmentMap = {
    1: "Digital Marketing",
    2: "Business Development",
    3: "Mobile Development",
    4: "Web Designing",
    5: "HR",
    6: "Admin",
    7: "Quality",
    8: "Web Development",
    9: "Other",
    10: "Content Writing",
  };

  // Error Validation

  const validatePersonalInfo = (data) => {
    const errors = {};

    // Name: required, max:25, only letters & spaces
    if (!data.name?.trim()) {
      errors.name = "Name is required.";
    } else if (data.name.length > 25) {
      errors.name = "Name cannot exceed 25 characters.";
    } else if (!/^[a-zA-Z\s]+$/.test(data.name)) {
      errors.name = "Name can only contain letters and spaces.";
    }

    // Job Title: required, string, max:255
    if (!data.job_title?.trim()) {
      errors.job_title = "Job Title is required.";
    } else if (data.job_title.length > 255) {
      errors.job_title = "Job Title cannot exceed 255 characters.";
    }

    // Grade: optional, max:50
    if (data.grade && data.grade.length > 50) {
      errors.grade = "Grade cannot exceed 50 characters.";
    }

    // Blood Group: optional, max:10
    if (data.blood_group && data.blood_group.length > 10) {
      errors.blood_group = "Blood Group cannot exceed 10 characters.";
    }

    // Location: required
    if (!data.location) {
      errors.location = "Location is required.";
    }

    // DOB: required, valid date
    if (!data.dob) {
      errors.dob = "Date of Birth is required.";
    }

    // Nationality: optional, max:100
    if (data.nationality && data.nationality.length > 100) {
      errors.nationality = "Nationality cannot exceed 100 characters.";
    }

    // Email: required, regex match
    if (!data.email) {
      errors.email = "Email is required.";
    } else if (!/(.+)@(.+)\.(.+)/i.test(data.email)) {
      errors.email = "Invalid email format.";
    }

    // Department: required
    if (!data.department) {
      errors.department = "Department is required.";
    }

    // Gender: required, in 1 or 2
    if (!data.gender) {
      errors.gender = "Gender is required.";
    } else if (!["1", "2"].includes(data.gender.toString())) {
      errors.gender = "Invalid gender selection.";
    }

    // Social URLs: optional, must match regex if present
    if (
      data.facebook &&
      !/^https?:\/\/(?:www\.)facebook\.com\/.+/i.test(data.facebook)
    ) {
      errors.facebook = "Invalid Facebook URL.";
    }
    if (
      data.linkedin &&
      !/^https?:\/\/(?:www\.)linkedin\.com\/.+/i.test(data.linkedin)
    ) {
      errors.linkedin = "Invalid LinkedIn URL.";
    }
    if (data.twitter && !/^https?:\/\/twitter\.com\/.+/i.test(data.twitter)) {
      errors.twitter = "Invalid Twitter URL.";
    }
    if (
      data.instagram &&
      !/^https?:\/\/(?:www\.)instagram\.com\/.+/i.test(data.instagram)
    ) {
      errors.instagram = "Invalid Instagram URL.";
    }

    return errors;
  };

  useEffect(() => {
    if (employeedata?.candidate) {
      // Construct on_candidate_id from candidate_id
      const candidateId = employeedata.candidate.candidate_id;
      const onCandidateId = candidateId;
      setFormData({
        ...employeedata.candidate,
        gender: employeedata?.candidateData?.gender || "",
        on_candidate_id: onCandidateId,
        updated_by: "hr-emp",
      });
    }
  }, [employeedata]);

  const handleEditClick = () => setIsEditing(true);

  const handleCancelClick = () => {
    setIsEditing(false);
    setErrors({});
    const candidateId = employeedata?.candidate?.candidate_id;
    const onCandidateId = candidateId;
    setFormData({
      ...employeedata.candidate,
      gender: employeedata?.candidateData?.gender || "",
      on_candidate_id: onCandidateId,
      updated_by: "hr-emp",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.on_candidate_id) {
      alert("Candidate ID is missing. Please contact support.");
      return;
    }
    const validationErrors = validatePersonalInfo(formData);
    setErrors(validationErrors); // ✅ Save errors to state
    if (Object.keys(validationErrors).length > 0) {
      return; // Stop submit if errors
    }

    try {
      const filteredFormData = {
        section: "personal",
        name: formData.name || "",
        job_title: formData.job_title || "",
        grade: formData.grade || "",
        blood_group: formData.blood_group || "",
        location: formData.location || "",
        dob: formData.dob || "",
        nationality: formData.nationality || "",
        email: formData.email || "",
        department: formData.department || "",
        gender: formData.gender || "",
        on_candidate_id: formData.on_candidate_id,
        updated_by: formData.updated_by || "hr-emp",
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/joining-form-submit`,
        filteredFormData,
        { withCredentials: true }
      );

      console.log("Success:", response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <div className="card card-primary card-sec">
        <div className="card-header">
          <h3 className="card-title form-header">Personal info</h3>
          {!isEditing && (
            <div className="card-tools wgz_value">
              <a
                onClick={handleEditClick}
                className="btn btn-tool wgz-edit-form"
                data-id="wgz-personal"
              >
                <i className="fas fa-edit"></i>
              </a>
            </div>
          )}

          {isEditing && (
            <div className="card-tools wgz_field">
              <button
                type="button"
                className="btn btn-info btn-xs wgz-close-form mr-1"
                data-id="wgz-personal"
                onClick={handleCancelClick}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
              <a
                className="btn btn-success btn-xs wgz-submit"
                data-id="wgz-personal"
                onClick={handleSubmit}
              >
                <i className="fas fa-check"></i> Update
              </a>
            </div>
          )}
        </div>

        <div className="card-body">
          <div className="row">
            <div className="col-sm-6 col-md-4">
              <div className="form-group">
                <label htmlFor="name" className="col-form-label">
                  Name<span className="req">*</span>
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="text"
                      value={formData?.name || ""}
                      name="name"
                      id="name"
                      maxLength="25"
                      onChange={handleInputChange}
                    />
                    {errors.name && <p className="error">{errors.name}</p>}
                  </div>
                ) : (
                  <div className="wgz_value">{formData?.name || "N/A"}</div>
                )}
              </div>
            </div>
            <div className="col-sm-6 col-md-4">
              <div className="form-group">
                <label htmlFor="job_title" className="col-form-label">
                  Job Title<span className="req">*</span>
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="text"
                      value={formData?.job_title || ""}
                      onChange={handleInputChange}
                      id="job_title"
                      name="job_title"
                    />
                    {errors.job_title && (
                      <p className="error">{errors.job_title}</p>
                    )}
                  </div>
                ) : (
                  <div className="wgz_value">
                    {formData?.job_title || "N/A"}
                  </div>
                )}
              </div>
            </div>

            <div className="col-sm-6 col-md-4">
              <div className="form-group">
                <label htmlFor="grade" className="col-form-label">
                  Grade
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="text"
                      value={formData?.grade || ""}
                      onChange={handleInputChange}
                      id="grade"
                      name="grade"
                    />
                    {errors.grade && <p className="error">{errors.grade}</p>}
                  </div>
                ) : (
                  <div className="wgz_value">{formData?.grade || "N/A"}</div>
                )}
              </div>
            </div>

            <div className="col-sm-6 col-md-4">
              <div className="form-group">
                <label htmlFor="blood_group" className="col-form-label">
                  Blood Group
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="text"
                      value={formData?.blood_group || ""}
                      onChange={handleInputChange}
                      id="blood_group"
                      name="blood_group"
                    />
                    {errors.blood_group && (
                      <p className="error">{errors.blood_group}</p>
                    )}
                  </div>
                ) : (
                  <div className="wgz_value">
                    {formData?.blood_group || "N/A"}
                  </div>
                )}
              </div>
            </div>

            <div className="col-sm-6 col-md-4">
              <div className="form-group">
                <label htmlFor="location" className="col-form-label">
                  Location<span className="req">*</span>
                </label>

                {isEditing ? (
                  <div className="wgz_field">
                    <select
                      className={`form-control ${
                        errors?.location ? "is-invalid" : ""
                      }`}
                      name="location"
                      value={formData?.location || ""}
                      onChange={handleInputChange}
                    >
                      <option value="">Select location..</option>
                      <option value="1">Office</option>
                      <option value="2">Remote</option>
                    </select>
                    {errors?.location && (
                      <div className="invalid-feedback">{errors.location}</div>
                    )}
                  </div>
                ) : (
                  <div className="wgz_value">
                    {formData?.location
                      ? formData.location === "1"
                        ? "Office"
                        : "Remote"
                      : "N/A"}
                  </div>
                )}
              </div>
            </div>

            <div className="col-sm-6 col-md-4">
              <div className="form-group">
                <label htmlFor="dob" className="col-form-label">
                  Date of Birth<span className="req">*</span>
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="date"
                      value={formData?.dob || ""}
                      onChange={handleInputChange}
                      id="dob"
                      name="dob"
                    />
                    {errors.dob && <p className="error">{errors.dob}</p>}
                  </div>
                ) : (
                  <div className="wgz_value">{formData?.dob || "N/A"}</div>
                )}
              </div>
            </div>
            <div className="col-sm-6 col-md-4">
              <div className="form-group">
                <label htmlFor="nationality" className="col-form-label">
                  Nationality
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="text"
                      value={formData?.nationality || ""}
                      onChange={handleInputChange}
                      id="nationality"
                      name="nationality"
                    />
                    {errors.nationality && (
                      <p className="error">{errors.nationality}</p>
                    )}
                  </div>
                ) : (
                  <div className="wgz_value">
                    {formData?.nationality || "N/A"}
                  </div>
                )}
              </div>
            </div>
            <div className="col-sm-6 col-md-4">
              <div className="form-group">
                <label htmlFor="email" className="col-form-label">
                  Email ID<span className="req">*</span>
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="email"
                      value={formData?.email || ""}
                      onChange={handleInputChange}
                      id="email"
                      name="email"
                    />
                    {errors.email && <p className="error">{errors.email}</p>}
                  </div>
                ) : (
                  <div className="wgz_value">{formData?.email || "N/A"}</div>
                )}
              </div>
            </div>

            <div className="col-sm-6 col-md-4">
              <div className="form-group">
                <label htmlFor="department" className="col-form-label">
                  Department<span className="req">*</span>
                </label>

                {isEditing ? (
                  <div className="wgz_field">
                    <select
                      className={`form-control ${
                        errors?.department ? "is-invalid" : ""
                      }`}
                      value={formData?.department || ""}
                      onChange={handleInputChange}
                      name="department"
                    >
                      <option value="">Select..</option>
                      <option value="1">Digital Marketing</option>
                      <option value="2">Business Development</option>
                      <option value="3">Mobile Development</option>
                      <option value="4">Web Designing</option>
                      <option value="5">HR</option>
                      <option value="6">Admin</option>
                      <option value="7">Quality</option>
                      <option value="8">Web Development</option>
                      <option value="9">Other</option>
                      <option value="10">Content Writing</option>
                    </select>

                    {errors?.department && (
                      <div className="invalid-feedback">
                        {errors.department}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="wgz_value">
                    {departmentMap[formData?.department] || "N/A"}
                  </div>
                )}
              </div>
            </div>

            <div className="col-sm-6 col-md-4">
              <div className="form-group">
                <label htmlFor="gender" className="col-form-label">
                  Gender<span className="req">*</span>
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <select
                      className="form-control"
                      value={formData?.gender || ""}
                      onChange={handleInputChange}
                      name="gender"
                    >
                      <option value="">Select Gender..</option>
                      <option value="1">Male</option>
                      <option value="2">Female</option>
                    </select>
                    {errors.gender && <p className="error">{errors.gender}</p>}
                  </div>
                ) : (
                  <div className="wgz_value">
                    {formData?.gender === "1"
                      ? "Male"
                      : formData?.gender === "2"
                      ? "Female"
                      : "N/A"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalInfoSection;
