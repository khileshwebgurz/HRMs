import React from 'react'
import { useState } from 'react';
import axios from 'axios';
const PersonalInfo = ({employeedata , user}) => {

    const [employee, setEmployee] = useState({
        name: employeedata.candidateData?.full_name || "",
        job_title: employeedata.candidate?.job_title ||  "",
        grade: employeedata.candidate?.grade ||  "",
        blood_group: employeedata.candidate?.blood_group ||  "",
        location: employeedata.candidate?.location || "",
        dob: employeedata.candidate?.dob ||  "",
        nationality: employeedata.candidate?.nationality || "",
        email: employeedata.candidate?.email || "",
        department: employeedata.candidate?.department || "",
        gender: employeedata.candidate?.gender || "",
        current_address: employeedata.candidate?.current_address || "",
        permanent_address: employeedata.candidate?.permanent_address ||  "",
        current_phone: employeedata.candidateData?.mobile_number || "",
        permanent_phone:  employeedata.candidate?.permanent_phone || "",
        emergency_name: employeedata.candidate?.emergency_name ||  "",
        emergency_relation: employeedata.candidate?.emergency_relation || "",
        emergency_contact: employeedata.candidate?.emergency_contact || "",
        emergency_name_2: employeedata.candidate?.emergency_name_2 || "",
        emergency_relation_2: employeedata.candidate?.emergency_relation_2 || "",
        emergency_contact_2: employeedata.candidate?.emergency_contact_2 || "",
        marital_status: employeedata.candidate || "",
        spouse_name_profession: employeedata.candidate?.spouse_name_profession || "",
        no_of_children: employeedata.candidate?.no_of_children ||  "",
        father_name: employeedata.candidate?.father_name || "",
        father_profession: employeedata.candidate?.father_profession || "",
        father_age: employeedata.candidate?.father_age || "",
        mother_name: employeedata.candidate?.mother_name || "",
        mother_profession: employeedata.candidate?.mother_profession || "",
        mother_age: employeedata.candidate?.mother_age || "",
        facebook: employeedata.candidate?.facebook || "",
        twitter: employeedata.candidate?.twitter || "",
        linkedin: employeedata.candidate?.linkedin || "",
        instagram: employeedata.candidate?.instagram || "",
        id_type: employeedata.candidate?.id_type || "",
        id_number: employeedata.candidate?.id_number || "",
        employment_history: employeedata.candidate || " ",  // it was [] we changed to string " ", fix later on
        education: employeedata.candidate || " ",  // it was [] we changed to string " ", fix later on,
        training: employeedata.candidate || " ",  // it was [] we changed to string " ", fix later on,
        certifications: employeedata.candidate || " ",  // it was [] we changed to string " ", fix later on,
        // references: [{ name: "", contact: "" }, { name: "", contact: "" }],
        other_info: employeedata.candidate || " ",  // it was [] we changed to string " ", fix later on,
      });
      
      const [editMode, setEditMode] = useState({}); // Track edit mode for each section

     // Handle input changes for simple fields
  const handleInputChange = (e, section, index = null, field = null) => {
    const { name, value } = e.target;
    if (index !== null && field) {
      // Handle array fields (e.g., employment_history, education)
      setEmployee((prev) => ({
        ...prev,
        [section]: prev[section].map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      }));
    } else {
      setEmployee((prev) => ({ ...prev, [name]: value }));
    }
   
  };

  // Toggle edit mode for a section
  const toggleEditMode = (sectionId) => {
    setEditMode((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  // Handle form submission
  const handleSubmit = async (e, sectionId) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/employee/profile/${user.id}`,
        employee,
        { withCredentials: true }
      );
      alert(`${sectionId} updated successfully!`);
      toggleEditMode(sectionId); // Exit edit mode
    } catch (error) {
      console.error(`Error updating ${sectionId}:`, error);
      alert(`Failed to update ${sectionId}`);
    }
  };

  // Add new row to dynamic sections
  const addRow = (section) => {
    setEmployee((prev) => ({
      ...prev,
      [section]: [...prev[section], {}],
    }));
  };

  // Delete row from dynamic sections
  // const deleteRow = (section, index) => {
  //   setEmployee((prev) => ({
  //     ...prev,
  //     [section]: prev[section].filter((_, i) => i !== index),
  //   }));
  // };


      // Render section with edit/save functionality
  const renderSection = (sectionId, title, content) => (
    <div className="card card-panel card-sec">
      <div className="card-header">
        <h3 className="card-title form-header">{title}</h3>
        <div className="card-tools">
          {!editMode[sectionId] ? (
            <a
              href="#"
              className="btn btn-tool wgz-edit-form"
              onClick={() => toggleEditMode(sectionId)}
            >
              <i className="fas fa-edit"></i>
            </a>
          ) : (
            <div className="wgz_field">
              <button
                type="button"
                className="btn btn-info btn-xs wgz-close-form mr-1"
                onClick={() => toggleEditMode(sectionId)}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
              <a
                href="#"
                className="btn btn-success btn-xs wgz-submit"
                onClick={(e) => handleSubmit(e, sectionId)}
              >
                <i className="fas fa-check"></i> Update
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="card-body">{content}</div>
    </div>
  );

  return (
    <>
    <section className="content mt-4 info-sec">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-primary card-sec">
              <div className="card-header">
                <h3 className="card-title">Personal Information</h3>
              </div>
              <div className="card-body">
                {/* Personal Info */}
                {renderSection(
                  "wgz-personal",
                  "Personal Info",
                  <form id="wgz-personal">
                    <div className="row">
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="name" className="col-form-label">
                            Name<span className="req">*</span>
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="name"
                            value={employeedata.candidateData?.full_name}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-personal"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="job_title" className="col-form-label">
                            Job Title
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="job_title"
                            value={employeedata.candidate?.job_title}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-personal"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="grade" className="col-form-label">
                            Grade
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="grade"
                            value={employeedata.candidate?.grade}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-personal"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="blood_group" className="col-form-label">
                            Blood Group
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="blood_group"
                            //value={employeedata.blood_group}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-personal"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="location" className="col-form-label">
                            Location<span className="req">*</span>
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="location"
                            value={employeedata.candidate?.location}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-personal"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="dob" className="col-form-label">
                            Date of Birth<span className="req">*</span>
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="dob"
                            value={employeedata.candidate?.dob}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-personal"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="nationality" className="col-form-label">
                            Nationality
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="nationality"
                            value={employeedata.candidate?.nationality}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-personal"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="email" className="col-form-label">
                            Email ID
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="email"
                            name="email"
                            value={employeedata.candidate?.email}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-personal"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="department" className="col-form-label">
                            Department<span className="req">*</span>
                          </label>
                          <select
                            className="form-control form-control-sm"
                            name="department"
                            value={employeedata.candidate?.department}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-personal"]}
                          >
                            {/* <option value="">Select...</option>
                            <option value="HR">HR</option>
                            <option value="IT">IT</option>
                            <option value="Finance">Finance</option> */}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="gender" className="col-form-label">
                            Gender<span className="req">*</span>
                          </label>
                          <select
                            className="form-control form-control-sm"
                            name="gender"
                            value={employeedata.candidate?.gender}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-personal"]}
                          >
                            {/* <option value="">Select Gender...</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option> */}
                          </select>
                        </div>
                      </div>
                    </div>
                  </form>
                )}

                {/* Addresses */}
                {renderSection(
                  "wgz-addresses",
                  "Addresses",
                  <form id="wgz-addresses">
                    <div className="row">
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="current_address" className="col-form-label">
                            Current Address<span className="req">*</span>
                          </label>
                          <textarea
                            className="form-control form-control-sm"
                            name="current_address"
                            //value={employeedata.current_address}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-addresses"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="permanent_address" className="col-form-label">
                            Permanent Address<span className="req">*</span>
                          </label>
                          <textarea
                            className="form-control form-control-sm"
                            name="permanent_address"
                            //value={employeedata.permanent_address}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-addresses"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="current_phone" className="col-form-label">
                            Contact No.<span className="req">*</span>
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="current_phone"
                            value={employeedata.candidateData?.mobile_number}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-addresses"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="permanent_phone" className="col-form-label">
                            Contact No.<span className="req">*</span>
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="permanent_phone"
                            //value={employeedata.permanent_phone}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-addresses"]}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                )}

                {/* Contact Info */}
                {renderSection(
                  "wgz-contactinfo",
                  "Contact Info",
                  <form id="wgz-contactinfo">
                    <div className="row">
                      <div className="col-lg-12">
                        <h5>In case of emergency contacts</h5>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="emergency_name" className="col-form-label">
                            Name
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="emergency_name"
                            //value={employeedata.emergency_name}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-contactinfo"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="emergency_relation" className="col-form-label">
                            Relation
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="emergency_relation"
                            //value={employeedata.emergency_relation}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-contactinfo"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="emergency_contact" className="col-form-label">
                            Contact No.
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="emergency_contact"
                            //value={employeedata.emergency_contact}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-contactinfo"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="emergency_name_2" className="col-form-label">
                            Name
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="emergency_name_2"
                            //value={employeedata.emergency_name_2}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-contactinfo"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="emergency_relation_2" className="col-form-label">
                            Relation
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="emergency_relation_2"
                            //value={employeedata.emergency_relation_2}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-contactinfo"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="emergency_contact_2" className="col-form-label">
                            Contact No.
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="emergency_contact_2"
                            //value={employeedata.emergency_contact_2}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-contactinfo"]}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                )}

                {/* Other Info */}
                {renderSection(
                  "wgz-otherinfo",
                  "Other Info",
                  <form id="wgz-otherinfo">
                    <div className="row">
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="marital_status" className="col-form-label">
                            Marital Status
                          </label>
                          <div className="form-check form-check-inline">
                            <label className="form-check-label">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="marital_status"
                                //value="1"
                                checked={employeedata.marital_status === "1"}
                                onChange={handleInputChange}
                                disabled={!editMode["wgz-otherinfo"]}
                              />
                              Single
                            </label>
                          </div>
                          <div className="form-check form-check-inline">
                            <label className="form-check-label">
                              <input
                                className="form-control form-check-input"
                                type="radio"
                                name="marital_status"
                                //value="2"
                                checked={employeedata.marital_status === "2"}
                                onChange={handleInputChange}
                                disabled={!editMode["wgz-otherinfo"]}
                              />
                              Married
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="spouse_name_profession" className="col-form-label">
                            Spouse’s Name and Profession
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="spouse_name_profession"
                            //value={employeedata.spouse_name_profession}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-otherinfo"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="no_of_children" className="col-form-label">
                            No. of Children
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="no_of_children"
                            //value={employeedata.no_of_children}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-otherinfo"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="father_name" className="col-form-label">
                            Father’s Name
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="father_name"
                            //value={employeedata.father_name}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-otherinfo"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="father_profession" className="col-form-label">
                            Profession
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="father_profession"
                            //value={employeedata.father_profession}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-otherinfo"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="father_age" className="col-form-label">
                            Age
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="father_age"
                            //value={employeedata.father_age}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-otherinfo"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="mother_name" className="col-form-label">
                            Mother’s Name
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="mother_name"
                            //value={employeedata.mother_name}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-otherinfo"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="mother_profession" className="col-form-label">
                            Profession
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="mother_profession"
                            //value={employeedata.mother_profession}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-otherinfo"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="mother_age" className="col-form-label">
                            Age
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="mother_age"
                            //value={employeedata.mother_age}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-otherinfo"]}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                )}

                {/* Social Profiles */}
                {renderSection(
                  "wgz-social",
                  "Social Profiles",
                  <form id="wgz-social">
                    <div className="row">
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="facebook" className="col-form-label">
                            Facebook
                          </label>
                          <textarea
                            className="form-control form-control-sm"
                            name="facebook"
                            //value={employeedata.facebook}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-social"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="twitter" className="col-form-label">
                            Twitter
                          </label>
                          <textarea
                            className="form-control form-control-sm"
                            name="twitter"
                            //value={employeedata.twitter}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-social"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="linkedin" className="col-form-label">
                            LinkedIn
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="linkedin"
                            //value={employeedata.linkedin}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-social"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="instagram" className="col-form-label">
                            Instagram<span className="req">*</span>
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="instagram"
                            //value={employeedata.instagram}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-social"]}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                )}

                {/* Employment History */}
                {renderSection(
                  "wgz-eh",
                  "Employment History",
                  <form id="wgz-eh">
                    <div className="table-responsive">
                      <p>Please list your most recent employer first (attach additional pages if required)</p>
                      <table className="table table-bordered" id="wgz_employment">
                        <thead>
                          <tr>
                            <th width="6%">S No.</th>
                            <th>From To</th>
                            <th>Organisation</th>
                            <th>Title and Key Responsibilities</th>
                            <th>Reporting To (Position)</th>
                            <th>Salary (PM) and Perks</th>
                            <th>Reasons for Leaving</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* {employeedata.employment_history.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <input
                                  className="form-control form-control-sm"
                                  type="text"
                                  name={`employment_history[${index}][fromto]`}
                                  //value={item.fromto || ""}
                                  onChange={(e) =>
                                    handleInputChange(e, "employment_history", index, "fromto")
                                  }
                                  disabled={!editMode["wgz-eh"]}
                                />
                              </td>
                              <td>
                                <textarea
                                  className="form-control form-control-sm"
                                  name={`employment_history[${index}][organisation]`}
                                  //value={item.organisation || ""}
                                  onChange={(e) =>
                                    handleInputChange(e, "employment_history", index, "organisation")
                                  }
                                  disabled={!editMode["wgz-eh"]}
                                />
                              </td>
                              <td>
                                <textarea
                                  className="form-control form-control-sm"
                                  name={`employment_history[${index}][responsibilities]`}
                                  //value={item.responsibilities || ""}
                                  onChange={(e) =>
                                    handleInputChange(e, "employment_history", index, "responsibilities")
                                  }
                                  disabled={!editMode["wgz-eh"]}
                                />
                              </td>
                              <td>
                                <textarea
                                  className="form-control form-control-sm"
                                  name={`employment_history[${index}][position]`}
                                  //value={item.position || ""}
                                  onChange={(e) =>
                                    handleInputChange(e, "employment_history", index, "position")
                                  }
                                  disabled={!editMode["wgz-eh"]}
                                />
                              </td>
                              <td>
                                <textarea
                                  className="form-control form-control-sm"
                                  name={`employment_history[${index}][salary]`}
                                  //value={item.salary || ""}
                                  onChange={(e) =>
                                    handleInputChange(e, "employment_history", index, "salary")
                                  }
                                  disabled={!editMode["wgz-eh"]}
                                />
                              </td>
                              <td>
                                <textarea
                                  className="form-control form-control-sm"
                                  name={`employment_history[${index}][reason]`}
                                  //value={item.reason || ""}
                                  onChange={(e) =>
                                    handleInputChange(e, "employment_history", index, "reason")
                                  }
                                  disabled={!editMode["wgz-eh"]}
                                />
                              </td>
                              <td>
                                {editMode["wgz-eh"] && (
                                  <a
                                    className="btn btn-xs delete-record-employment"
                                    onClick={() => deleteRow("employment_history", index)}
                                  >
                                    <i className="fas fa-trash"></i>
                                  </a>
                                )}
                              </td>
                            </tr>
                          ))} */}
                        </tbody>
                      </table>
                      {editMode["wgz-eh"] && (
                        <a
                          className="btn btn-primary btn-xs add-employment"
                          onClick={() => addRow("employment_history")}
                        >
                          <i className="fas fa-plus"></i> Add Row
                        </a>
                      )}
                    </div>
                  </form>
                )}

                {/* Education Details */}
                {renderSection(
                  "wgz-ed",
                  "Education Details",
                  <form id="wgz-ed">
                    <div className="table-responsive">
                      <table className="table table-bordered" id="wgz_edu_details">
                        <thead>
                          <tr>
                            <th width="6%">S No.</th>
                            <th>Qualification</th>
                            <th>University/Board</th>
                            <th>Specialization</th>
                            <th>Year of Passing</th>
                            <th>Grade/CGPA</th>
                            <th width="5%">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* {employeedata.education.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <textarea
                                  className="form-control form-control-sm"
                                  name={`education[${index}][qualification]`}
                                  //value={item.qualification || ""}
                                  onChange={(e) =>
                                    handleInputChange(e, "education", index, "qualification")
                                  }
                                  disabled={!editMode["wgz-ed"]}
                                />
                              </td>
                              <td>
                                <textarea
                                  className="form-control form-control-sm"
                                  name={`education[${index}][university]`}
                                  //value={item.university || ""}
                                  onChange={(e) =>
                                    handleInputChange(e, "education", index, "university")
                                  }
                                  disabled={!editMode["wgz-ed"]}
                                />
                              </td>
                              <td>
                                <textarea
                                  className="form-control form-control-sm"
                                  name={`education[${index}][specialization]`}
                                  //value={item.specialization || ""}
                                  onChange={(e) =>
                                    handleInputChange(e, "education", index, "specialization")
                                  }
                                  disabled={!editMode["wgz-ed"]}
                                />
                              </td>
                              <td>
                                <select
                                  className="custom-select"
                                  name={`education[${index}][passing_year]`}
                                  //value={item.passing_year || ""}
                                  onChange={(e) =>
                                    handleInputChange(e, "education", index, "passing_year")
                                  }
                                  disabled={!editMode["wgz-ed"]}
                                >
                                  <option //value="">Select Year</option>
                                  {[...Array(50)].map((_, i) => (
                                    <option key={i} //value={2025 - i}>
                                      {2025 - i}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <textarea
                                  className="form-control form-control-sm"
                                  name={`education[${index}][grade]`}
                                  //value={item.grade || ""}
                                  onChange={(e) =>
                                    handleInputChange(e, "education", index, "grade")
                                  }
                                  disabled={!editMode["wgz-ed"]}
                                />
                              </td>
                              <td>
                                {editMode["wgz-ed"] && (
                                  <a
                                    className="btn btn-xs delete-record"
                                    onClick={() => deleteRow("education", index)}
                                  >
                                    <i className="fas fa-trash"></i>
                                  </a>
                                )}
                              </td>
                            </tr>
                          ))} */}
                        </tbody>
                      </table>
                      {editMode["wgz-ed"] && (
                        <a
                          className="btn btn-primary btn-xs add-education"
                          onClick={() => addRow("education")}
                        >
                          <i className="fas fa-plus"></i> Add Row
                        </a>
                      )}
                    </div>
                  </form>
                )}

                {/* Training */}
                {renderSection(
                  "wgz-tranind",
                  "Training",
                  <form id="wgz-tranind">
                    <div className="table-responsive">
                      <table className="table table-bordered" id="wgz_language">
                        <thead>
                          <tr>
                            <th width="2%">S No.</th>
                            <th width="10%">Course Module</th>
                            <th width="10%">Location</th>
                            <th width="10%">Conducted By</th>
                            <th width="10%">Month/Year</th>
                            <th width="5%">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* {employeedata.training.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <textarea
                                  className="form-control form-control-sm"
                                  name={`training[${index}][course]`}
                                  //value={item.course || ""}
                                  onChange={(e) =>
                                    handleInputChange(e, "training", index, "course")
                                  }
                                  disabled={!editMode["wgz-tranind"]}
                                />
                              </td>
                              <td>
                                <textarea
                                  className="form-control form-control-sm"
                                  name={`training[${index}][location]`}
                                  //value={item.location || ""}
                                  onChange={(e) =>
                                    handleInputChange(e, "training", index, "location")
                                  }
                                  disabled={!editMode["wgz-tranind"]}
                                />
                              </td>
                              <td>
                                <textarea
                                  className="form-control form-control-sm"
                                  name={`training[${index}][conductby]`}
                                  //value={item.conductby || ""}
                                  onChange={(e) =>
                                    handleInputChange(e, "training", index, "conductby")
                                  }
                                  disabled={!editMode["wgz-tranind"]}
                                />
                              </td>
                              <td>
                                <textarea
                                  className="form-control form-control-sm"
                                  name={`training[${index}][monthyear]`}
                                  //value={item.monthyear || ""}
                                  onChange={(e) =>
                                    handleInputChange(e, "training", index, "monthyear")
                                  }
                                  disabled={!editMode["wgz-tranind"]}
                                />
                              </td>
                              <td>
                                {editMode["wgz-tranind"] && (
                                  <a
                                    className="btn btn-xs delete-record-language"
                                    onClick={() => deleteRow("training", index)}
                                  >
                                    <i className="fas fa-trash"></i>
                                  </a>
                                )}
                              </td>
                            </tr>
                          ))} */}
                        </tbody>
                      </table>
                      {editMode["wgz-tranind"] && (
                        <a
                          className="btn btn-primary btn-xs add-language"
                          onClick={() => addRow("training")}
                        >
                          <i className="fas fa-plus"></i> Add Row
                        </a>
                      )}
                    </div>
                  </form>
                )}

                {/* ID Proof */}
                {renderSection(
                  "wgz-idprof",
                  "ID Proof",
                  <form id="wgz-idprof">
                    <div className="row">
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="id_type" className="col-form-label">
                            Type of ID
                          </label>
                          <select
                            className="form-control form-control-sm"
                            name="id_type"
                            //value={employeedata.id_type}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-idprof"]}
                          >
                            {/* <option value="">Select...</option>
                            <option value="Passport">Passport</option>
                            <option value="Driver's License">Driver's License</option>
                            <option value="National ID">National ID</option> */}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="id_number" className="col-form-label">
                            ID No
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="id_number"
                            //value={employeedata.id_number}
                            onChange={handleInputChange}
                            disabled={!editMode["wgz-idprof"]}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                )}

                {/* Certifications */}
                {renderSection(
                  "wgz-certi",
                  "Certification[s] (Academic or Extra-Curricular)",
                  <form id="wgz-certi">
                    <div className="table-responsive">
                      <table className="table table-bordered" id="wgz_family">
                        <thead>
                          <tr>
                            <th width="2%">S No.</th>
                            <th width="10%">Name</th>
                            <th width="10%">Board/Society</th>
                            <th width="10%">Month/Year</th>
                            <th width="5%">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* {employeedata.certifications.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <textarea
                                  className="form-control form-control-sm"
                                  name={`certifications[${index}][name]`}
                                  //value={item.name || ""}
                                  onChange={(e) =>
                                    handleInputChange(e, "certifications", index, "name")
                                  }
                                  disabled={!editMode["wgz-certi"]}
                                />
                              </td>
                              <td>
                                <textarea
                                  className="form-control form-control-sm"
                                  name={`certifications[${index}][board]`}
                                  //value={item.board || ""}
                                  onChange={(e) =>
                                    handleInputChange(e, "certifications", index, "board")
                                  }
                                  disabled={!editMode["wgz-certi"]}
                                />
                              </td>
                              <td>
                                <textarea
                                  className="form-control form-control-sm"
                                  name={`certifications[${index}][monthyear]`}
                                  //value={item.monthyear || ""}
                                  onChange={(e) =>
                                    handleInputChange(e, "certifications", index, "monthyear")
                                  }
                                  disabled={!editMode["wgz-certi"]}
                                />
                              </td>
                              <td>
                                {editMode["wgz-certi"] && (
                                  <a
                                    className="btn btn-xs delete-record"
                                    onClick={() => deleteRow("certifications", index)}
                                  >
                                    <i className="fas fa-trash"></i>
                                  </a>
                                )}
                              </td>
                            </tr>
                          ))} */}
                        </tbody>
                      </table>
                      {editMode["wgz-certi"] && (
                        <a
                          className="btn btn-primary btn-xs add-family"
                          onClick={() => addRow("certifications")}
                        >
                          <i className="fas fa-plus"></i> Add Row
                        </a>
                      )}
                    </div>
                  </form>
                )}

                {/* References */}
                {renderSection(
                  "wgz-refer",
                  "References [Name two individuals who can provide professional reference]",
                  <form id="wgz-refer">
                    <div className="row">
                      <div className="col-md-4 col-sm-6">
                        <label className="col-form-label">
                          <u>Reference no. 1 :</u>
                        </label>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="references[0][name]" className="col-form-label">
                            Name
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="references[0][name]"
                            // //value={employeedata.references[0]?.name || ""}
                            onChange={(e) =>
                              handleInputChange(e, "references", 0, "name")
                            }
                            disabled={!editMode["wgz-refer"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="references[0][contact]" className="col-form-label">
                            Contact No
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="number"
                            name="references[0][contact]"
                            // //value={employeedata.references[0]?.contact || ""}
                            onChange={(e) =>
                              handleInputChange(e, "references", 0, "contact")
                            }
                            disabled={!editMode["wgz-refer"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <label className="col-form-label">
                          <u>Reference no. 2 :</u>
                        </label>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="references[1][name]" className="col-form-label">
                            Name
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            name="references[1][name]"
                            // //value={employeedata.references[1]?.name || ""}
                            onChange={(e) =>
                              handleInputChange(e, "references", 1, "name")
                            }
                            disabled={!editMode["wgz-refer"]}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="references[1][contact]" className="col-form-label">
                            Contact No
                          </label>
                          <input
                            className="form-control form-control-sm"
                            type="number"
                            name="references[1][contact]"
                            // //value={employeedata.references[1]?.contact || ""}
                            onChange={(e) =>
                              handleInputChange(e, "references", 1, "contact")
                            }
                            disabled={!editMode["wgz-refer"]}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                )}

                {/* Other Information */}
                {renderSection(
                  "wgz-otherinfoQuiz",
                  "Other Information",
                  <form id="wgz-otherinfoQuiz">
                    <div className="table-responsive">
                      <table className="table table-bordered other-information">
                        <thead>
                          <tr>
                            <th width="40%">Details</th>
                            <th width="10%"></th>
                            <th>If Yes, Please Elaborate:</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* {employeedata.other_info.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <textarea
                                  className="form-control form-control-sm"
                                  name={`other_info[${index}][details]`}
                                  //value={item.details || ""}
                                  onChange={(e) =>
                                    handleInputChange(e, "other_info", index, "details")
                                  }
                                  disabled={!editMode["wgz-otherinfoQuiz"]}
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  name={`other_info[${index}][checked]`}
                                  checked={item.checked || false}
                                  onChange={(e) =>
                                    handleInputChange(e, "other_info", index, "checked")
                                  }
                                  disabled={!editMode["wgz-otherinfoQuiz"]}
                                />
                              </td>
                              <td>
                                <textarea
                                  className="form-control form-control-sm"
                                  name={`other_info[${index}][elaboration]`}
                                  //value={item.elaboration || ""}
                                  onChange={(e) =>
                                    handleInputChange(e, "other_info", index, "elaboration")
                                  }
                                  disabled={!editMode["wgz-otherinfoQuiz"]}
                                />
                              </td>
                            </tr>
                          ))} */}
                        </tbody>
                      </table>
                      {editMode["wgz-otherinfoQuiz"] && (
                        <a
                          className="btn btn-primary btn-xs add-other-info"
                          onClick={() => addRow("other_info")}
                        >
                          <i className="fas fa-plus"></i> Add Row
                        </a>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

export default PersonalInfo