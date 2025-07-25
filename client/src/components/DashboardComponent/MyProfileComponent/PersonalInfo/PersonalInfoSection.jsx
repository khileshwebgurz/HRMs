import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
const PersonalInfoSection = ({ employeedata }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});


  // console.log('my employee data is >>', employeedata)
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

  useEffect(() => {
    // Set initial form data from props
    if (employeedata?.candidate) {
      setFormData({
        ...employeedata.candidate,
        gender: employeedata?.candidateData?.gender || "",
      });
    }
  }, [employeedata]);

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({
      ...employeedata.candidate,
      gender: employeedata?.candidateData?.gender || "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    console.log('my form data is >>',formData)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/joining-form-submit`,
        formData,
        { withCredentials: true }
      );

      // if (!response.ok) throw new Error("Failed to submit");

      const data = await response.data;
      console.log("Success:", data);
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
          {/* Personal Info */}
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
                      maxlength="25"
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <div className="wgz_value ">
                    {employeedata?.candidate?.name || "N/A"}
                  </div>
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
                  </div>
                ) : (
                  <div className="wgz_value ">
                    {employeedata?.candidate?.job_title}
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
                  </div>
                ) : (
                  <div className="wgz_value ">
                    {employeedata?.candidate?.grade}
                  </div>
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
                  </div>
                ) : (
                  <div className="wgz_value ">
                    {employeedata?.candidate?.blood_group}
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
                      className="form-control"
                      name="location"
                      value={formData?.location || ""}
                      onChange={handleInputChange}
                      
                    >
                      <option value="">Select location..</option>
                      <option value="1">Office</option>
                      <option value="2">Remote</option>
                    </select>
                  </div>
                ) : (
                  <div className="wgz_value ">
                    {employeedata?.candidate?.location || ""}
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
                      type="text"
                      value={formData?.dob || ""}
                      onChange={handleInputChange}
                      id="dob"
                      name="dob"
                    />
                  </div>
                ) : (
                  <div className="wgz_value">
                    {employeedata?.candidate?.dob || ""}
                  </div>
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
                  </div>
                ) : (
                  <div className="wgz_value ">
                    {employeedata?.candidate?.nationality || ""}
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
                  </div>
                ) : (
                  <div className="wgz_value ">
                    {employeedata?.candidate?.email || ""}
                  </div>
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
                      className="form-control"
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
                  </div>
                ) : (
                  <div className="wgz_value">
                    {departmentMap[employeedata?.candidate?.department] ||
                      "N/A"}
                  </div>
                )}
              </div>
            </div>

            <div className="col-sm-6 col-md-4">
              <div className="form-group">
                <label htmlFor="location" className="col-form-label">
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
                  </div>
                ) : (
                  <div className="wgz_value">
                    {employeedata?.candidateData?.gender === "1"
                      ? "Male"
                      : employeedata?.candidateData?.gender === "2"
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
