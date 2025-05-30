import React, { useState } from "react";


const BasicInfo = ({ employeeData }) => {
  const [formData, setFormData] = useState({
    joining_date: employeeData?.joining_date || "",
    date_of_relieving: employeeData?.date_of_relieving || "",
    joining_salary: employeeData?.joining_salary || "",
    current_salary: employeeData?.current_salary || "",
    email: employeeData?.email || "",
    skype_id: employeeData?.skype_id || "",
    basecamp_id: employeeData?.basecamp_id || "",
    bank_account_holder_name: employeeData?.bank_account_holder_name || "",
    bank_name: employeeData?.bank_name || "",
    bank_account_number: employeeData?.bank_account_number || "",
    bank_branch_name: employeeData?.bank_branch_name || "",
    bank_city: employeeData?.bank_city || "",
    bank_ifsc: employeeData?.bank_ifsc || "",
    candidate_id: employeeData?.candidate_id || "",
    employee_id: employeeData?.employee_id || "",
  });
  const [editMode, setEditMode] = useState({}); // Track edit mode for each section

  // Handle input changes
  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log("Input changed:", name, value);
  };

  // Toggle edit mode for a section
  const toggleEditMode = (sectionId) => {
    setEditMode((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  // Handle form submission
  // const handleSubmit = async (e, sectionId) => {
  //   e.preventDefault();
  //   try {
  //     await axios.post(
  //       `http://localhost:8000/api/employee/update/${employeeData.id}`,
  //       { ...formData, updated_form: `${sectionId} updated`, updated_by: "hr-emp" },
  //       { withCredentials: true }
  //     );
  //     alert(`${sectionId} updated successfully!`);
  //     toggleEditMode(sectionId); // Exit edit mode
  //   } catch (error) {
  //     console.error(`Error updating ${sectionId}:`, error);
  //     alert(`Failed to update ${sectionId}`);
  //   }
  // };

  // Render section with edit/save functionality
  const renderSection = (sectionId, title, content) => (
    <div className="card wgz-card card-panel mt-2">
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
      <section className="content mt-4 Official-page">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-primary shadow-none">
                <div className="card-header">
                  <h3 className="card-title">Official Information</h3>
                </div>
                <div className="card-body" id="personalForm">
                  {/* changed className from tab-content to tab-content-1 */}
                  <div
                    className="tab-content-1"
                    id="custom-tabs-four-tabContent"
                  >
                    <div className="col-lg-12">
                      {/* Basic Info */}
                      {renderSection(
                        "wgz-basicinfo",
                        "Basic Info",
                        <form id="wgz-basicinfo">
                          <input
                            type="hidden"
                            name="updated_form"
                            // value="Basic info updated."
                            onChange={handleInput}
                          />
                          <input type="hidden" name="updated_by" />
                          <input
                            type="hidden"
                            name="candidate_id"
                            value={formData.candidate_id}
                            onChange={handleInput}
                          />
                          <input
                            type="hidden"
                            name="employee_id"
                            value={formData.employee_id}
                            onChange={handleInput}
                          />
                          <div className="row">
                            <div className="col-md-4 col-sm-6">
                              <div className="form-group">
                                <label
                                  htmlFor="joining_date"
                                  className="col-form-label"
                                >
                                  Date of Joining
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="joining_date"
                                  value={formData.joining_date}
                                  onChange={handleInput}
                                  disabled={!editMode["wgz-basicinfo"]}
                                />
                              </div>
                            </div>
                            <div className="col-md-4 col-sm-6">
                              <div className="form-group">
                                <label
                                  htmlFor="date_of_relieving"
                                  className="col-form-label"
                                >
                                  Date of Relieving
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="date_of_relieving"
                                  value={formData.date_of_relieving}
                                  onChange={handleInput}
                                  disabled={!editMode["wgz-basicinfo"]}
                                />
                              </div>
                            </div>
                            <div className="col-md-4 col-sm-6">
                              <div className="form-group">
                                <label
                                  htmlFor="joining_salary"
                                  className="col-form-label"
                                >
                                  Joining Salary
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="joining_salary"
                                  value={formData.joining_salary}
                                  onChange={handleInput}
                                  disabled={!editMode["wgz-basicinfo"]}
                                />
                              </div>
                            </div>
                            <div className="col-md-4 col-sm-6">
                              <div className="form-group">
                                <label
                                  htmlFor="current_salary"
                                  className="col-form-label"
                                >
                                  Current Salary
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="current_salary"
                                  value={formData.current_salary}
                                  onChange={handleInput}
                                  disabled={!editMode["wgz-basicinfo"]}
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
                          <input
                            type="hidden"
                            name="updated_form"
                            // value="Contact info updated."
                          />
                          <input type="hidden" name="updated_by" />
                          <input
                            type="hidden"
                            name="candidate_id"
                            value={formData.candidate_id}
                            onChange={handleInput}
                          />
                          <input
                            type="hidden"
                            name="employee_id"
                            value={formData.employee_id}
                            onChange={handleInput}
                          />
                          <div className="row">
                            <div className="col-md-4 col-sm-6">
                              <div className="form-group">
                                <label
                                  htmlFor="email"
                                  className="col-form-label"
                                >
                                  Official Email
                                </label>
                                <input
                                  className="form-control"
                                  type="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleInput}
                                  disabled={!editMode["wgz-contactinfo"]}
                                />
                              </div>
                            </div>
                            <div className="col-md-4 col-sm-6">
                              <div className="form-group">
                                <label
                                  htmlFor="skype_id"
                                  className="col-form-label"
                                >
                                  Skype ID
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="skype_id"
                                  value={formData.skype_id}
                                  onChange={handleInput}
                                  disabled={!editMode["wgz-contactinfo"]}
                                />
                              </div>
                            </div>
                            <div className="col-md-4 col-sm-6">
                              <div className="form-group">
                                <label
                                  htmlFor="basecamp_id"
                                  className="col-form-label"
                                >
                                  Basecamp ID
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="basecamp_id"
                                  value={formData.basecamp_id}
                                  onChange={handleInput}
                                  disabled={!editMode["wgz-contactinfo"]}
                                />
                              </div>
                            </div>
                          </div>
                        </form>
                      )}

                      {/* Salary Account Details */}
                      {renderSection(
                        "wgz-bankinfo",
                        "Salary Account Details",
                        <form id="wgz-bankinfo">
                          <input
                            type="hidden"
                            name="updated_form"
                            // value="Salary Account Details updated."
                          />
                          <input type="hidden" name="updated_by" />
                          <input
                            type="hidden"
                            name="candidate_id"
                            value={formData.candidate_id}
                            onChange={handleInput}
                          />
                          <input
                            type="hidden"
                            name="employee_id"
                            value={formData.employee_id}
                            onChange={handleInput}
                          />
                          <div className="row">
                            <div className="col-md-4 col-sm-6">
                              <div className="form-group">
                                <label
                                  htmlFor="bank_account_holder_name"
                                  className="col-form-label"
                                >
                                  Account Holder's Name
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="bank_account_holder_name"
                                  value={formData.bank_account_holder_name}
                                  onChange={handleInput}
                                  disabled={!editMode["wgz-bankinfo"]}
                                />
                              </div>
                            </div>
                            <div className="col-md-4 col-sm-6">
                              <div className="form-group">
                                <label
                                  htmlFor="bank_name"
                                  className="col-form-label"
                                >
                                  Bank Name
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="bank_name"
                                  value={formData.bank_name}
                                  onChange={handleInput}
                                  disabled={!editMode["wgz-bankinfo"]}
                                />
                              </div>
                            </div>
                            <div className="col-md-4 col-sm-6">
                              <div className="form-group">
                                <label
                                  htmlFor="bank_account_number"
                                  className="col-form-label"
                                >
                                  Account No.
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="bank_account_number"
                                  value={formData.bank_account_number}
                                  onChange={handleInput}
                                  disabled={!editMode["wgz-bankinfo"]}
                                />
                              </div>
                            </div>
                            <div className="col-md-4 col-sm-6">
                              <div className="form-group">
                                <label
                                  htmlFor="bank_branch_name"
                                  className="col-form-label"
                                >
                                  Branch Name
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="bank_branch_name"
                                  value={formData.bank_branch_name}
                                  onChange={handleInput}
                                  disabled={!editMode["wgz-bankinfo"]}
                                />
                              </div>
                            </div>
                            <div className="col-md-4 col-sm-6">
                              <div className="form-group">
                                <label
                                  htmlFor="bank_city"
                                  className="col-form-label"
                                >
                                  City
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="bank_city"
                                  value={formData.bank_city}
                                  onChange={handleInput}
                                  disabled={!editMode["wgz-bankinfo"]}
                                />
                              </div>
                            </div>
                            <div className="col-md-4 col-sm-6">
                              <div className="form-group">
                                <label
                                  htmlFor="bank_ifsc"
                                  className="col-form-label"
                                >
                                  IFSC Code
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="bank_ifsc"
                                  value={formData.bank_ifsc}
                                  onChange={handleInput}
                                  disabled={!editMode["wgz-bankinfo"]}
                                />
                              </div>
                            </div>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BasicInfo;
