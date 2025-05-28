import React from "react";

const MyProfile = () => {
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
                <div className="card-body1" id="personalForm">
                  <div className="tab-content" id="custom-tabs-four-tabContent">
                    <div className="row">
                      <div className="col-lg-12">
                        <form action="" method="post" id="wgz-personal">
                          <input
                            type="hidden"
                            name="updated_form"
                            value="Personal info updated."
                          />{" "}
                          <input
                            type="hidden"
                            name="updated_by"
                            value="hr-emp"
                          />{" "}
                          <input
                            type="hidden"
                            name="on_candidate_id"
                            value="{{$candidate_id}}"
                          />{" "}
                          <input
                            type="hidden"
                            name="on_employee_id"
                            value="{{$employee_id}}"
                          />
                          {/* @csrf */}
                          <div className="card wgz-personal card-panel card-sec">
                            <div className="card-header">
                              <h3 className="card-title form-header">
                                Personal info
                              </h3>
                              <div className="card-tools wgz_value">
                                <a
                                  href="javascript:void(0)"
                                  className="btn btn-tool wgz-edit-form"
                                  data-id="wgz-personal"
                                >
                                  <i className="fas fa-edit"></i>
                                </a>
                              </div>

                              <div className="card-tools wgz_field">
                                <button
                                  type="button"
                                  className="btn btn-info btn-xs wgz-close-form mr-1"
                                  data-id="wgz-personal"
                                >
                                  <i className="fas fa-times"></i> Cancel
                                </button>
                                <a
                                  href="javascript:void(0)"
                                  className="btn btn-success btn-xs wgz-submit"
                                  data-id="wgz-personal"
                                >
                                  {" "}
                                  <i className="fas fa-check"></i> Update
                                </a>
                              </div>
                            </div>

                            <div className="card-body">
                              <div className="row">
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group">
                                    <label for="name" className="col-form-label">
                                      Name<span className="req">*</span>
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$candidate->name}}"
                                        disabled
                                      />
                                    </div>
                                    <div className="wgz_value "></div>
                                  </div>
                                </div>
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group">
                                    <label
                                      for="job_title"
                                      className="col-form-label"
                                    >
                                      Job Title
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$candidate->job_title}}"
                                        disabled
                                      />
                                    </div>
                                    <div className="wgz_value "></div>
                                  </div>
                                </div>

                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group">
                                    <label for="grade" className="col-form-label">
                                      Grade
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$candidate->grade}}"
                                        id="grade"
                                        name="grade"
                                        disabled=""
                                      />
                                    </div>

                                    <div className="wgz_value "></div>
                                  </div>
                                </div>

                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group">
                                    <label
                                      for="blood_group"
                                      className="col-form-label"
                                    >
                                      Blood Group
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$candidate->blood_group}}"
                                        id="blood_group"
                                        name="blood_group"
                                      />
                                    </div>
                                    <div className="wgz_value "></div>
                                  </div>
                                </div>

                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group">
                                    <label
                                      for="location"
                                      className="col-form-label"
                                    >
                                      Location<span className="req">*</span>
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$candidate->location}}"
                                        id="location"
                                        name="location"
                                      />
                                    </div>

                                    <div className="wgz_value "></div>
                                  </div>
                                </div>

                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group">
                                    <label for="dob" className="col-form-label">
                                      Date of Birth<span className="req">*</span>
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$candidate->dob}}"
                                        disabled
                                      />
                                    </div>

                                    <div className="wgz_value "></div>
                                  </div>
                                </div>
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group">
                                    <label
                                      for="nationality"
                                      className="col-form-label"
                                    >
                                      Nationality
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$candidate->nationality}}"
                                        id="nationality"
                                        name="nationality"
                                      />
                                    </div>

                                    <div className="wgz_value "></div>
                                  </div>
                                </div>
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group">
                                    <label for="email" className="col-form-label">
                                      Email ID
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="email"
                                        value="{{$candidate->email}}"
                                        disabled
                                      />
                                    </div>
                                    <div className="wgz_value "></div>
                                  </div>
                                </div>

                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group">
                                    <label
                                      for="department"
                                      className="col-form-label"
                                    >
                                      Department<span className="req">*</span>
                                    </label>
                                    <div className="wgz_field">
                                      <select
                                        className="form-control form-control-sm"
                                        disabled
                                      >
                                        <option value="">Select..</option>

                                        <option value="{{$dk}}">
                                          {/* {{ $dv }} */}
                                        </option>
                                      </select>
                                    </div>
                                    <div className="wgz_value "></div>
                                  </div>
                                </div>
                              </div>

                              <div className="col-sm-6 col-md-4">
                                <div className="form-group">
                                  <label for="gender" className="col-form-label">
                                    Gender<span className="req">*</span>
                                  </label>
                                  <div className="wgz_field">
                                    <select className="form-control" name="gender">
                                      <option value="">Select Gender..</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>

                        <form action="" method="post" id="wgz-addresses">
                          <input
                            type="hidden"
                            name="updated_form"
                            value="Addresses info updated."
                          />{" "}
                          <input
                            type="hidden"
                            name="updated_by"
                            value="hr-emp"
                          />{" "}
                          <input
                            type="hidden"
                            name="on_candidate_id"
                            value="{{$candidate_id}}"
                          />{" "}
                          <input
                            type="hidden"
                            name="on_employee_id"
                            value="{{$employee_id}}"
                          />
                          {/* @csrf */}
                          <div className="card wgz-addresses  card-panel">
                            <div className="card-header">
                              <h3 className="card-title form-header">Addresses</h3>
                              <div className="card-tools wgz_value">
                                <a
                                  href="javascript:void(0)"
                                  className="btn btn-tool wgz-edit-form"
                                  data-id="wgz-addresses"
                                >
                                  <i className="fas fa-edit"></i>
                                </a>
                              </div>

                              <div className="card-tools wgz_field">
                                <button
                                  type="button"
                                  className="btn btn-info btn-xs wgz-close-form mr-1"
                                  data-id="wgz-addresses"
                                >
                                  <i className="fas fa-times"></i> Cancel
                                </button>

                                <a
                                  href="javascript:void(0)"
                                  className="btn btn-success btn-xs wgz-submit"
                                  data-id="wgz-addresses"
                                >
                                  {" "}
                                  <i className="fas fa-check"></i>
                                  Update
                                </a>
                              </div>
                            </div>

                            <div className="card-body">
                              <div className="row">
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group ">
                                    <label
                                      for="current_address"
                                      className=" col-form-label"
                                    >
                                      Current Address<span className="req">*</span>
                                    </label>
                                    <div className="wgz_field">
                                      <textarea
                                        className="form-control form-control-sm"
                                        id="current_address"
                                        name="current_address"
                                      ></textarea>
                                    </div>
                                    <div className="wgz_value "></div>
                                  </div>
                                </div>
                                <div className="col-md-4 col-sm-6"></div>
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group ">
                                    <label
                                      for="permanent_address"
                                      className="col-form-label"
                                    >
                                      Permanent Address
                                      <span className="req">*</span>
                                    </label>
                                    <div className="wgz_field">
                                      <textarea
                                        className="form-control form-control-sm"
                                        id="permanent_address"
                                        name="permanent_address"
                                      ></textarea>
                                    </div>
                                    <div className="wgz_value mt-2"></div>
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group row">
                                    <label
                                      for="current_phone"
                                      className="col-4 col-form-label"
                                    >
                                      Contact No.<span className="req">*</span>
                                    </label>
                                    <div className="col-8 wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$candidate->current_phone}}"
                                        id="current_phone"
                                        name="current_phone"
                                      />
                                    </div>
                                    <div className="wgz_value mt-2"></div>
                                  </div>
                                </div>
                                <div className="col-md-4 col-sm-6"></div>
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group row">
                                    <label
                                      for="permanent_phone"
                                      className="col-4 col-form-label"
                                    >
                                      Contact No.<span className="req">*</span>
                                    </label>
                                    <div className="col-8 wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$candidate->permanent_phone}}"
                                        id="permanent_phone"
                                        name="permanent_phone"
                                      />
                                    </div>
                                    <div className="wgz_value mt-2"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>

                        <form action="" method="post" id="wgz-contactinfo">
                          <input
                            type="hidden"
                            name="updated_form"
                            value="Contact info updated."
                          />{" "}
                          <input
                            type="hidden"
                            name="updated_by"
                            value="hr-emp"
                          />{" "}
                          <input
                            type="hidden"
                            name="on_candidate_id"
                            value="{{$candidate_id}}"
                          />{" "}
                          <input
                            type="hidden"
                            name="on_employee_id"
                            value="{{$employee_id}}"
                          />
                          {/* @csrf */}
                          <div className="card wgz-contactinfo card-panel">
                            <div className="card-header">
                              <h3 className="card-title form-header">
                                Contact info
                              </h3>
                              <div className="card-tools wgz_value">
                                <a
                                  href="javascript:void(0)"
                                  className="btn btn-tool wgz-edit-form"
                                  data-id="wgz-contactinfo"
                                >
                                  {" "}
                                  <i className="fas fa-edit"></i>
                                </a>
                              </div>

                              <div className="card-tools wgz_field">
                                <button
                                  type="button"
                                  className="btn btn-info btn-xs wgz-close-form mr-1"
                                  data-id="wgz-contactinfo"
                                >
                                  <i className="fas fa-times"></i> Cancel
                                </button>
                                <a
                                  href="javascript:void(0)"
                                  className="btn btn-success btn-xs wgz-submit"
                                  data-id="wgz-contactinfo"
                                >
                                  {" "}
                                  <i className="fas fa-check"></i>
                                  Update
                                </a>
                              </div>
                            </div>
                            <div className="card-body">
                              <div className="row">
                                <div className="col-lg-12">
                                  <h5>In case of emergency contacts</h5>
                                </div>
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group ">
                                    <label
                                      for="emergency_name"
                                      className=" col-form-label"
                                    >
                                      Name
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$candidate->emergency_name}}"
                                        id="emergency_name"
                                        name="emergency_name"
                                      />
                                    </div>
                                    <div className="wgz_value "></div>
                                  </div>
                                </div>
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group ">
                                    <label
                                      for="emergency_relation"
                                      className=" col-form-label"
                                    >
                                      Relation
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$candidate->emergency_relation}}"
                                        id="emergency_relation"
                                        name="emergency_relation"
                                      />
                                    </div>
                                    <div className="wgz_value "></div>
                                  </div>
                                </div>
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group ">
                                    <label
                                      for="emergency_contact"
                                      className=" col-form-label"
                                    >
                                      Contact No.
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$candidate->emergency_contact}}"
                                        id="emergency_contact"
                                        name="emergency_contact"
                                      />
                                    </div>
                                    <div className="wgz_value "></div>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group ">
                                    <label
                                      for="emergency_name_2"
                                      className=" col-form-label"
                                    >
                                      Name
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$candidate->emergency_name_2}}"
                                        id="emergency_name_2"
                                        name="emergency_name_2"
                                      />
                                    </div>
                                    <div className="wgz_value "></div>
                                  </div>
                                </div>
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group ">
                                    <label
                                      for="emergency_relation_2"
                                      className=" col-form-label"
                                    >
                                      Relation
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$candidate->emergency_relation_2}}"
                                        id="emergency_relation_2"
                                        name="emergency_relation_2"
                                      />
                                    </div>
                                    <div className="wgz_value "></div>
                                  </div>
                                </div>
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group ">
                                    <label
                                      for="emergency_contact_2"
                                      className=" col-form-label"
                                    >
                                      Contact No.
                                    </label>
                                    <div className="wgz_field ">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$candidate->emergency_contact_2}}"
                                        id="emergency_contact_2"
                                        name="emergency_contact_2"
                                      />
                                    </div>
                                    <div className="wgz_value "></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>

                        <form action="" method="post" id="wgz-otherinfo">
                          <input
                            type="hidden"
                            name="updated_form"
                            value="Other info updated."
                          />{" "}
                          <input
                            type="hidden"
                            name="updated_by"
                            value="hr-emp"
                          />{" "}
                          <input
                            type="hidden"
                            name="on_candidate_id"
                            value="{{$candidate_id}}"
                          />{" "}
                          <input
                            type="hidden"
                            name="on_employee_id"
                            value="{{$employee_id}}"
                          />
                          {/* @csrf */}
                          <div className="card wgz-otherinfo card-panel">
                            <div className="card-header">
                              <h3 className="card-title form-header">Other info</h3>
                              <div className="card-tools wgz_value">
                                <a
                                  href="javascript:void(0)"
                                  className="btn btn-tool wgz-edit-form"
                                  data-id="wgz-otherinfo"
                                >
                                  <i className="fas fa-edit"></i>
                                </a>
                              </div>

                              <div className="card-tools wgz_field">
                                <button
                                  type="button"
                                  className="btn btn-info btn-xs wgz-close-form mr-1"
                                  data-id="wgz-otherinfo"
                                >
                                  <i className="fas fa-times"></i> Cancel
                                </button>
                                <a
                                  href="javascript:void(0)"
                                  className="btn btn-success btn-xs wgz-submit"
                                  data-id="wgz-otherinfo"
                                >
                                  {" "}
                                  <i className="fas fa-check"></i>
                                  Update
                                </a>
                              </div>
                            </div>
                            <div className="card-body">
                              <div className="row">
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group ">
                                    <label
                                      for="marital_status"
                                      className=" col-form-label"
                                    >
                                      Marital Status
                                    </label>

                                    <div className="wgz_field">
                                      <div className="form-check form-check-inline">
                                        <label className="form-check-label">
                                          {" "}
                                          <input
                                            className="form-check-input"
                                            type="radio"
                                            name="marital_status"
                                            id="marital_status1"
                                            value="1"
                                          />
                                          Single
                                        </label>
                                      </div>
                                      <div className="form-check form-check-inline">
                                        <label className="form-check-label">
                                          {" "}
                                          <input
                                            className="form-check-input"
                                            type="radio"
                                            name="marital_status"
                                            id="marital_status2"
                                            value="2"
                                          />{" "}
                                          Married
                                        </label>
                                      </div>
                                    </div>
                                    <div className="wgz_value "></div>
                                  </div>
                                </div>
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group ">
                                    <label
                                      for="spouse_name_profession"
                                      className=" col-form-label"
                                    >
                                      Spouse’s name and profession
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$candidate->spouse_name_profession}}"
                                        id="spouse_name_profession"
                                        name="spouse_name_profession"
                                      />
                                    </div>
                                    <div className="wgz_value "></div>
                                  </div>
                                </div>
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group ">
                                    <label
                                      for="no_of_children"
                                      className=" col-form-label"
                                    >
                                      No. of children
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$candidate->no_of_children}}"
                                        id="no_of_children"
                                        name="no_of_children"
                                      />
                                    </div>
                                    <div className="wgz_value "></div>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group ">
                                    <label
                                      for="father_name"
                                      className=" col-form-label"
                                    >
                                      Father’s name
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$candidate->father_name}}"
                                        id="father_name"
                                        name="father_name"
                                      />
                                    </div>
                                    <div className="wgz_value "></div>
                                  </div>
                                </div>
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group ">
                                    <label
                                      for="father_profession"
                                      className=" col-form-label"
                                    >
                                      Profession
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$candidate->father_profession}}"
                                        id="father_profession"
                                        name="father_profession"
                                      />
                                    </div>
                                    <div className="wgz_value "></div>
                                  </div>
                                </div>
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group ">
                                    <label
                                      for="father_age"
                                      className=" col-form-label"
                                    >
                                      Age
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$candidate->father_age}}"
                                        id="father_age"
                                        name="father_age"
                                      />
                                    </div>
                                    <div className="wgz_value "></div>
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group ">
                                    <label
                                      for="mother_name"
                                      className=" col-form-label"
                                    >
                                      Mother’s name
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$candidate->mother_name}}"
                                        id="mother_name"
                                        name="mother_name"
                                      />
                                    </div>
                                    <div className="wgz_value "></div>
                                  </div>
                                </div>
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group ">
                                    <label
                                      for="mother_profession"
                                      className=" col-form-label"
                                    >
                                      Profession
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$candidate->mother_profession}}"
                                        id="mother_profession"
                                        name="mother_profession"
                                      />
                                    </div>
                                    <div className="wgz_value "></div>
                                  </div>
                                </div>
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group ">
                                    <label
                                      for="mother_age"
                                      className=" col-form-label"
                                    >
                                      Age
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$candidate->mother_age}}"
                                        id="mother_age"
                                        name="mother_age"
                                      />
                                    </div>
                                    <div className="wgz_value "></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>

                        <form action="" method="post" id="wgz-social">
                          <input
                            type="hidden"
                            name="updated_form"
                            value="Social profile info updated."
                          />{" "}
                          <input
                            type="hidden"
                            name="updated_by"
                            value="hr-emp"
                          />{" "}
                          <input
                            type="hidden"
                            name="on_candidate_id"
                            value="{{$candidate_id}}"
                          />{" "}
                          <input
                            type="hidden"
                            name="on_employee_id"
                            value="{{$employee_id}}"
                          />
                          {/* @csrf */}
                          <div className="card wgz-social  card-panel">
                            <div className="card-header">
                              <h3 className="card-title form-header">
                                Social Profiles
                              </h3>
                              <div className="card-tools wgz_value">
                                <a
                                  href="javascript:void(0)"
                                  className="btn btn-tool wgz-edit-form"
                                  data-id="wgz-social"
                                >
                                  <i className="fas fa-edit"></i>
                                </a>
                              </div>

                              <div className="card-tools wgz_field">
                                <button
                                  type="button"
                                  className="btn btn-info btn-xs wgz-close-form mr-1"
                                  data-id="wgz-social"
                                >
                                  <i className="fas fa-times"></i> Cancel
                                </button>

                                <a
                                  href="javascript:void(0)"
                                  className="btn btn-success btn-xs wgz-submit"
                                  data-id="wgz-social"
                                >
                                  {" "}
                                  <i className="fas fa-check"></i>
                                  Update
                                </a>
                              </div>
                            </div>

                            <div className="card-body">
                              <div className="row">
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group ">
                                    <label
                                      for="facebook"
                                      className=" col-form-label"
                                    >
                                      Facebook
                                    </label>
                                    <div className="wgz_field">
                                      <textarea
                                        className="form-control form-control-sm"
                                        id="facebook"
                                        name="facebook"
                                      ></textarea>
                                    </div>
                                    <div className="wgz_value "></div>
                                  </div>
                                </div>
                                <div className="col-md-4 col-sm-6"></div>
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group ">
                                    <label for="twitter" className="col-form-label">
                                      Twitter
                                    </label>
                                    <div className="wgz_field">
                                      <textarea
                                        className="form-control form-control-sm"
                                        id="twitter"
                                        name="twitter"
                                      ></textarea>
                                    </div>
                                    <div className="wgz_value mt-2"></div>
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group ">
                                    <label
                                      for="linkedin"
                                      className="col-form-label"
                                    >
                                      LinkedIn
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$candidate->linkedin}}"
                                        id="linkedin"
                                        name="linkedin"
                                      />
                                    </div>
                                    <div className="wgz_value mt-2"></div>
                                  </div>
                                </div>
                                <div className="col-md-4 col-sm-6"></div>
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group ">
                                    <label
                                      for="instagram"
                                      className="col-form-label"
                                    >
                                      Instagram<span className="req">*</span>
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$candidate->instagram}}"
                                        id="instagram"
                                        name="instagram"
                                      />
                                    </div>
                                    <div className="wgz_value mt-2"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>

                        <form action="" method="post" id="wgz-eh">
                          <input
                            type="hidden"
                            name="updated_form"
                            value="Employment History updated."
                          />{" "}
                          <input
                            type="hidden"
                            name="updated_by"
                            value="hr-emp"
                          />{" "}
                          <input
                            type="hidden"
                            name="on_candidate_id"
                            value="{{$candidate_id}}"
                          />{" "}
                          <input
                            type="hidden"
                            name="on_employee_id"
                            value="{{$employee_id}}"
                          />
                          {/* @csrf */}
                          <div className="card wgz-eh card-panel">
                            <div className="card-header">
                              <h3 className="card-title form-header">
                                Employment History
                              </h3>
                              <div className="card-tools wgz_value">
                                <a
                                  href="javascript:void(0)"
                                  className="btn btn-tool wgz-edit-form"
                                  data-id="wgz-eh"
                                >
                                  {" "}
                                  <i className="fas fa-edit"></i>
                                </a>
                              </div>

                              <div className="card-tools wgz_field">
                                <button
                                  type="button"
                                  className="btn btn-info btn-xs wgz-close-form mr-1"
                                  data-id="wgz-eh"
                                >
                                  <i className="fas fa-times"></i> Cancel
                                </button>
                                <a
                                  href="javascript:void(0)"
                                  className="btn btn-success btn-xs wgz-submit mr-1"
                                  data-id="wgz-eh"
                                >
                                  {" "}
                                  <i className="fas fa-check"></i> Update
                                </a>{" "}
                                <a
                                  className="btn btn-primary btn-xs add-employment"
                                  data-added="0"
                                >
                                  <i className="fas fa-plus"></i> Add Row
                                </a>
                              </div>
                            </div>

                            <div className="card-body table-responsive">
                              <p>
                                Please list your most recent employer first
                                (attach additional pages if required)
                              </p>
                              <table
                                className="table table-bordered "
                                id="wgz_employment"
                              >
                                <thead>
                                  <tr>
                                    <th width="6%">S No.</th>
                                    <th>From To</th>
                                    <th>ORGANISATION</th>
                                    <th>
                                      TITLE AND KEY RESPONSIBILITIES in Short
                                    </th>
                                    <th>REPORTING TO(POSITION)</th>
                                    <th>SALARY (PM) AND PERKS</th>
                                    <th>REASONS FOR LEAVING</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr
                                    className="wgz_field_table"
                                    id="rec-employment-{{$emk}}"
                                  >
                                    <td>
                                      <span className="sn"></span>
                                    </td>
                                    <td>
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$emv->fromto}}"
                                        name="employment_history[{{$emk}}][fromto]"
                                        autocomplete="nope"
                                      />
                                    </td>
                                    <td>
                                      <textarea
                                        className="form-control form-control-sm"
                                        name="employment_history[{{$emk}}][organisation]"
                                        rows="6"
                                      ></textarea>
                                    </td>
                                    <td>
                                      <textarea
                                        className="form-control form-control-sm"
                                        name="employment_history[{{$emk}}][responsibitlies]"
                                        rows="6"
                                      ></textarea>
                                    </td>
                                    <td>
                                      <textarea
                                        className="form-control form-control-sm"
                                        name="employment_history[{{$emk}}][position]"
                                        rows="6"
                                      ></textarea>
                                    </td>
                                    <td>
                                      <textarea
                                        className="form-control form-control-sm"
                                        name="employment_history[{{$emk}}][salary]"
                                        rows="6"
                                      ></textarea>
                                    </td>
                                    <td>
                                      <textarea
                                        className="form-control form-control-sm"
                                        name="employment_history[{{$emk}}][reason]"
                                        rows="6"
                                      ></textarea>
                                    </td>
                                    <td>
                                      <a
                                        className="btn btn-xs delete-record-employment"
                                        // style=""
                                        data-id="{{$emk}}"
                                      >
                                        <i className="fas fa-trash"></i>
                                      </a>
                                    </td>
                                  </tr>

                                  <tr className="wgz_value_table">
                                    <td>
                                      <span className="sn"></span>
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </form>

                        <form action="" method="post" id="wgz-ed">
                          <input
                            type="hidden"
                            name="updated_form"
                            value="Education Details updated."
                          />{" "}
                          <input
                            type="hidden"
                            name="updated_by"
                            value="hr-emp"
                          />{" "}
                          <input
                            type="hidden"
                            name="on_candidate_id"
                            value="{{$candidate_id}}"
                          />{" "}
                          <input
                            type="hidden"
                            name="on_employee_id"
                            value="{{$employee_id}}"
                          />
                          {/* @csrf */}
                          <div className="card wgz-ed card-panel">
                            <div className="card-header">
                              <h3 className="card-title form-header">
                                Education Details
                              </h3>
                              <div className="card-tools wgz_value">
                                <a
                                  href="javascript:void(0)"
                                  className="btn btn-tool wgz-edit-form"
                                  data-id="wgz-ed"
                                >
                                  {" "}
                                  <i className="fas fa-edit"></i>
                                </a>
                              </div>

                              <div className="card-tools wgz_field">
                                <button
                                  type="button"
                                  className="btn btn-info btn-xs wgz-close-form mr-1"
                                  data-id="wgz-ed"
                                >
                                  <i className="fas fa-times"></i> Cancel
                                </button>
                                <a
                                  href="javascript:void(0)"
                                  className="btn btn-success btn-xs wgz-submit mr-1"
                                  data-id="wgz-ed"
                                >
                                  {" "}
                                  <i className="fas fa-check"></i> Update
                                </a>{" "}
                                <a
                                  className="btn btn-primary btn-xs add-education"
                                  data-added="0"
                                >
                                  <i className="fas fa-plus"></i> Add Row
                                </a>
                              </div>
                            </div>

                            <div className="card-body  table-responsive">
                              <table
                                className="table table-bordered "
                                id="wgz_edu_details"
                              >
                                <thead>
                                  <tr>
                                    <th width="6%">S No.</th>
                                    <th>Qualification</th>
                                    <th>University/board</th>
                                    <th>Specialization</th>
                                    <th>Year of passing</th>
                                    <th>Grade /CGPA</th>
                                    <th width="5%">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr
                                    className="wgz_field_table"
                                    id="rec-{{$eduk}}"
                                  >
                                    <td>
                                      <span className="sn"></span>
                                    </td>
                                    <td>
                                      <textarea
                                        className="form-control form-control-sm"
                                        rows="2"
                                        name="education[{{$eduk}}][qualificaion]"
                                      ></textarea>
                                    </td>
                                    <td>
                                      <textarea
                                        className="form-control form-control-sm"
                                        rows="2"
                                        name="education[{{$eduk}}][university]"
                                      ></textarea>
                                    </td>
                                    <td>
                                      <textarea
                                        className="form-control form-control-sm"
                                        rows="2"
                                        name="education[{{$eduk}}][specialization]"
                                      ></textarea>
                                    </td>
                                    <td>
                                      <select
                                        className="custom-select"
                                        name="education[{{$eduk}}][passing_year]"
                                      >
                                        <option value="">-Select Year-</option>

                                        <option value="{{$j}}"></option>
                                      </select>
                                    </td>
                                    <td>
                                      <textarea
                                        className="form-control form-control-sm"
                                        rows="2"
                                        name="education[{{$eduk}}][grade]"
                                      ></textarea>
                                    </td>
                                    <td>
                                      <a
                                        className="btn btn-xs delete-record"
                                        // style=""
                                        data-id="{{$eduk}}"
                                      >
                                        <i className="fas fa-trash"></i>
                                      </a>
                                    </td>
                                  </tr>

                                  <tr className="wgz_value_table">
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </form>

                        <form action="" method="post" id="wgz-tranind">
                          <input
                            type="hidden"
                            name="updated_form"
                            value="Traning updated."
                          />{" "}
                          <input
                            type="hidden"
                            name="updated_by"
                            value="hr-emp"
                          />{" "}
                          <input
                            type="hidden"
                            name="on_candidate_id"
                            value="{{$candidate_id}}"
                          />{" "}
                          <input
                            type="hidden"
                            name="on_employee_id"
                            value="{{$employee_id}}"
                          />
                          {/* @csrf */}
                          <div className="card wgz-tranind card-panel">
                            <div className="card-header">
                              <h3 className="card-title form-header">Traning</h3>
                              <div className="card-tools wgz_value">
                                <a
                                  href="javascript:void(0)"
                                  className="btn btn-tool wgz-edit-form"
                                  data-id="wgz-tranind"
                                >
                                  {" "}
                                  <i className="fas fa-edit"></i>
                                </a>
                              </div>

                              <div className="card-tools wgz_field">
                                <button
                                  type="button"
                                  className="btn btn-info btn-xs wgz-close-form mr-1"
                                  data-id="wgz-tranind"
                                >
                                  <i className="fas fa-times"></i> Cancel
                                </button>
                                <a
                                  href="javascript:void(0)"
                                  className="btn btn-success btn-xs wgz-submit mr-1"
                                  data-id="wgz-tranind"
                                >
                                  {" "}
                                  <i className="fas fa-check"></i> Update
                                </a>{" "}
                                <a
                                  className="btn btn-primary btn-xs add-language"
                                  data-added="0"
                                >
                                  <i className="fas fa-plus"></i> Add Row
                                </a>
                              </div>
                            </div>
                            <div className="card-body  table-responsive">
                              <table
                                className="table table-bordered "
                                id="wgz_language"
                              >
                                <thead>
                                  <tr>
                                    <th width="2%">S No.</th>
                                    <th width="10%">Course module</th>
                                    <th width="10%">Location</th>
                                    <th width="10%">Conducted by</th>
                                    <th width="10%">Month/year</th>
                                    <th width="5%">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr
                                    className="wgz_field_table"
                                    id="rec-language-{{$tk}}"
                                  >
                                    <td>
                                      <span className="sn"></span>
                                    </td>
                                    <td>
                                      <textarea
                                        className="form-control form-control-sm"
                                        rows="2"
                                        name="training[{{$tk}}][course]"
                                      ></textarea>
                                    </td>
                                    <td>
                                      <textarea
                                        className="form-control form-control-sm"
                                        rows="2"
                                        name="training[{{$tk}}][location]"
                                      ></textarea>
                                    </td>
                                    <td>
                                      <textarea
                                        className="form-control form-control-sm"
                                        rows="2"
                                        name="training[{{$tk}}][conductby]"
                                      ></textarea>
                                    </td>
                                    <td>
                                      <textarea
                                        className="form-control form-control-sm"
                                        rows="2"
                                        name="training[{{$tk}}][monthyear]"
                                      ></textarea>
                                    </td>
                                    <td>
                                      <a
                                        className="btn btn-xs delete-record-language"
                                        // style=""
                                        data-id="{{$tk}}]"
                                      >
                                        <i className="fas fa-trash"></i>
                                      </a>
                                    </td>
                                  </tr>

                                  <tr className="wgz_value_table">
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </form>

                        <form action="" method="post" id="wgz-idprof">
                          <input
                            type="hidden"
                            name="updated_form"
                            value="ID Proof updated."
                          />{" "}
                          <input
                            type="hidden"
                            name="updated_by"
                            value="hr-emp"
                          />{" "}
                          <input
                            type="hidden"
                            name="on_candidate_id"
                            value="{{$candidate_id}}"
                          />{" "}
                          <input
                            type="hidden"
                            name="on_employee_id"
                            value="{{$employee_id}}"
                          />
                          {/* @csrf */}
                          <div className="card wgz-idprof card-panel">
                            <div className="card-header">
                              <h3 className="card-title form-header">ID Proof</h3>
                              <div className="card-tools wgz_value">
                                <a
                                  href="javascript:void(0)"
                                  className="btn btn-tool wgz-edit-form"
                                  data-id="wgz-idprof"
                                >
                                  {" "}
                                  <i className="fas fa-edit"></i>
                                </a>
                              </div>

                              <div className="card-tools wgz_field">
                                <button
                                  type="button"
                                  className="btn btn-info btn-xs wgz-close-form mr-1"
                                  data-id="wgz-idprof"
                                >
                                  <i className="fas fa-times"></i> Cancel
                                </button>
                                <a
                                  href="javascript:void(0)"
                                  className="btn btn-success btn-xs wgz-submit mr-1"
                                  data-id="wgz-idprof"
                                >
                                  {" "}
                                  <i className="fas fa-check"></i> Update
                                </a>
                              </div>
                            </div>
                            <div className="card-body">
                              <div className="row">
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group">
                                    <label for="id_type" className="col-form-label">
                                      Type of ID
                                    </label>
                                    <div className="wgz_field">
                                      <select
                                        className="form-control form-control-sm"
                                        name="id_type"
                                      >
                                        <option value="">Select..</option>

                                        <option value="{{$dk}}"></option>
                                      </select>
                                    </div>

                                    <div className="wgz_value"></div>
                                  </div>
                                </div>
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group">
                                    <label
                                      for="id_number"
                                      className="col-form-label"
                                    >
                                      ID No
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$candidate->id_number}}"
                                        id="id_number"
                                        name="id_number"
                                      />
                                    </div>
                                    <div className="wgz_value"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>

                        <form action="" method="post" id="wgz-certi">
                          <input
                            type="hidden"
                            name="updated_form"
                            value="Certification updated."
                          />{" "}
                          <input
                            type="hidden"
                            name="updated_by"
                            value="hr-emp"
                          />{" "}
                          <input
                            type="hidden"
                            name="on_candidate_id"
                            value="{{$candidate_id}}"
                          />{" "}
                          <input
                            type="hidden"
                            name="on_employee_id"
                            value="{{$employee_id}}"
                          />
                          <div className="card wgz-certi card-panel">
                            <div className="card-header">
                              <h3 className="card-title form-header">
                                Certification[s] (Academic or Extra-Curricular)
                              </h3>
                              <div className="card-tools wgz_value">
                                <a
                                  href="javascript:void(0)"
                                  className="btn btn-tool wgz-edit-form"
                                  data-id="wgz-certi"
                                >
                                  {" "}
                                  <i className="fas fa-edit"></i>
                                </a>
                              </div>

                              <div className="card-tools wgz_field">
                                <button
                                  type="button"
                                  className="btn btn-info btn-xs wgz-close-form mr-1"
                                  data-id="wgz-certi"
                                >
                                  <i className="fas fa-times"></i> Cancel
                                </button>
                                <a
                                  href="javascript:void(0)"
                                  className="btn btn-success btn-xs wgz-submit mr-1"
                                  data-id="wgz-certi"
                                >
                                  {" "}
                                  <i className="fas fa-check"></i> Update
                                </a>{" "}
                                <a
                                  className="btn btn-primary btn-xs add-family"
                                  data-added="0"
                                >
                                  <i className="fas fa-plus"></i> Add Row
                                </a>
                              </div>
                            </div>

                            <div className="card-body  table-responsive">
                              <table
                                className="table table-bordered "
                                id="wgz_family"
                              >
                                <thead>
                                  <tr>
                                    <th width="2%">S No.</th>
                                    <th width="10%">Name</th>
                                    <th width="10%">Board/society</th>
                                    <th width="10%">Month/year</th>
                                    <th width="5%">Action</th>
                                  </tr>
                                </thead>
                                <tbody></tbody>
                              </table>
                            </div>
                          </div>
                        </form>

                        <form action="" method="post" id="wgz-refer">
                          <input
                            type="hidden"
                            name="updated_form"
                            value="References info updated."
                          />{" "}
                          <input
                            type="hidden"
                            name="updated_by"
                            value="hr-emp"
                          />{" "}
                          <input
                            type="hidden"
                            name="on_candidate_id"
                            value="{{$candidate_id}}"
                          />{" "}
                          <input
                            type="hidden"
                            name="on_employee_id"
                            value="{{$employee_id}}"
                          />
                          <div className="card wgz-refer card-panel">
                            <div className="card-header">
                              <h3 className="card-title form-header">
                                References [Name two individuals who can provide
                                professional reference]
                              </h3>
                              <div className="card-tools wgz_value">
                                <a
                                  href="javascript:void(0)"
                                  className="btn btn-tool wgz-edit-form"
                                  data-id="wgz-refer"
                                >
                                  {" "}
                                  <i className="fas fa-edit"></i>
                                </a>
                              </div>

                              <div className="card-tools wgz_field">
                                <button
                                  type="button"
                                  className="btn btn-info btn-xs wgz-close-form mr-1"
                                  data-id="wgz-refer"
                                >
                                  <i className="fas fa-times"></i> Cancel
                                </button>
                                <a
                                  href="javascript:void(0)"
                                  className="btn btn-success btn-xs wgz-submit"
                                  data-id="wgz-refer"
                                >
                                  {" "}
                                  <i className="fas fa-check"></i> Update
                                </a>
                              </div>
                            </div>
                            <div className="card-body">
                              <div className="row">
                                <div className="col-md-4 col-sm-6">
                                  <label
                                    for="references[0][name]"
                                    className=" col-form-label"
                                  >
                                    <u>Reference no. 1 :</u>
                                  </label>
                                </div>
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group ">
                                    <label
                                      for="references[0][name]"
                                      className=" col-form-label"
                                    >
                                      Name
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$refer[0]->name}}"
                                        id="references[0][name]"
                                        name="references[0][name]"
                                      />
                                    </div>
                                    <div className="wgz_value "></div>
                                  </div>
                                </div>
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group ">
                                    <label
                                      for="references[0][contact]"
                                      className=" col-form-label"
                                    >
                                      Contact No
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="number"
                                        value="{{$refer[0]->contact}}"
                                        id="references[0][contact]"
                                        name="reference_1_contact"
                                      />
                                    </div>
                                    <div className="wgz_value "></div>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-4 col-sm-6">
                                  <label
                                    for="references[0][name]"
                                    className=" col-form-label"
                                  >
                                    <u>Reference no. 2 :</u>
                                  </label>
                                </div>
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group ">
                                    <label
                                      for="references[1][name]"
                                      className=" col-form-label"
                                    >
                                      Name
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="text"
                                        value="{{$refer[1]->name}}"
                                        id="references[1][name]"
                                        name="references[1][name]"
                                      />
                                    </div>
                                    <div className="wgz_value "></div>
                                  </div>
                                </div>
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-group ">
                                    <label
                                      for="references[1][contact]"
                                      className=" col-form-label"
                                    >
                                      Contact No
                                    </label>
                                    <div className="wgz_field">
                                      <input
                                        className="form-control form-control-sm"
                                        type="number"
                                        value="{{$refer[1]->contact}}"
                                        id="references[1][contact]"
                                        name="reference_2_contact"
                                      />
                                    </div>
                                    <div className="wgz_value "></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>

                        <form action="" method="post" id="wgz-otherinfoQuiz">
                          <input
                            type="hidden"
                            name="updated_form"
                            value="Other Information updated."
                          />{" "}
                          <input
                            type="hidden"
                            name="updated_by"
                            value="hr-emp"
                          />{" "}
                          <input
                            type="hidden"
                            name="on_candidate_id"
                            value="{{$candidate_id}}"
                          />{" "}
                          <input
                            type="hidden"
                            name="on_employee_id"
                            value="{{$employee_id}}"
                          />
                          {/* @csrf */}
                          <div className="card wgz-otherinfoQuiz card-panel">
                            <div className="card-header">
                              <h3 className="card-title form-header">
                                Other Information
                              </h3>
                              <div className="card-tools wgz_value">
                                <a
                                  href="javascript:void(0)"
                                  className="btn btn-tool wgz-edit-form"
                                  data-id="wgz-otherinfoQuiz"
                                >
                                  {" "}
                                  <i className="fas fa-edit"></i>
                                </a>
                              </div>

                              <div className="card-tools wgz_field">
                                <button
                                  type="button"
                                  className="btn btn-info btn-xs wgz-close-form mr-1"
                                  data-id="wgz-otherinfoQuiz"
                                >
                                  <i className="fas fa-times"></i> Cancel
                                </button>
                                <a
                                  href="javascript:void(0)"
                                  className="btn btn-success btn-xs wgz-submit mr-1"
                                  data-id="wgz-otherinfoQuiz"
                                >
                                  {" "}
                                  <i className="fas fa-check"></i>
                                  Update
                                </a>
                              </div>
                            </div>

                            <div className="card-body  table-responsive">
                              <table className="table table-bordered other-infomation">
                                <thead>
                                  <tr>
                                    <th width="40%">DETAILS</th>
                                    <th width="10%">&nbsp;</th>
                                    <th>IF YES, PLEASE ELABORATE:</th>
                                  </tr>
                                </thead>
                                <tbody></tbody>
                              </table>
                            </div>
                          </div>
                        </form>
                      </div>
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

export default MyProfile;
