import React from "react";
import "../assets/css/leaves.css";
const Leaves = () => {
  return (
    <>
      <div className="container leave-page">
        <div className="row profile">
          <div className="col-md-12">
            <div className="card card-primary mt-4">
              <div className="card-header">
                <h3 className="card-title">Leaves</h3>
              </div>
              <div className="card-body">
                <div className="container">
                  <div className="row">
                    <div className="col-xl-12 mb-4 mb-xl-0">
                      <section>
                        <ul className="nav nav-tabs " id="myTab" role="tablist">
                          <li className="nav-item waves-effect waves-light">
                            <a
                              className="nav-link active"
                              id="home-tab"
                              data-toggle="tab"
                              href="#home"
                              role="tab"
                              aria-controls="home"
                              aria-selected="false"
                            >
                              Apply Leave
                            </a>
                          </li>
                          <li className="nav-item waves-effect waves-light">
                            <a
                              className="nav-link "
                              id="profile-tab"
                              data-toggle="tab"
                              href="#profile"
                              role="tab"
                              aria-controls="profile"
                              aria-selected="false"
                            >
                              Log
                            </a>
                          </li>

                          <li className="nav-item waves-effect waves-light">
                            <a
                              className="nav-link"
                              id="teamleaves-tab"
                              data-toggle="tab"
                              href="#teamleaves"
                              role="tab"
                              aria-controls="teamleaves"
                              aria-selected="false"
                            >
                              Leave Requests
                            </a>
                          </li>
                        </ul>
                        <div className="tab-content" id="myTabContent">
                          <div
                            className="tab-pane fade active show"
                            id="home"
                            role="tabpanel"
                            aria-labelledby="home-tab"
                          >
                            <br />
                            <div className="row">
                              <div className="col-sm-6">
                                <h5>Apply Leave</h5>
                              </div>
                              <div className="col-sm-6">
                                <button
                                  type="button"
                                  className="btn btn-warning btn-sm  site-main-btn leave-btn"
                                  data-toggle="modal"
                                  data-target="#exampleModalCenter"
                                >
                                  Apply Leave
                                </button>
                              </div>
                            </div>
                            <div className="table-responsive">
                              <table className="table mt-4">
                                <thead>
                                  <tr>
                                    <th>Details</th>
                                    <th>Jan</th>
                                    <th>Feb</th>
                                    <th>Mar</th>
                                    <th>Apr</th>
                                    <th>May</th>
                                    <th>June</th>
                                    <th>Jul</th>
                                    <th>Aug</th>
                                    <th>Sep</th>
                                    <th>Oct</th>
                                    <th>Nov</th>
                                    <th>Dec</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Credit Leaves</td>
                                  </tr>
                                  <tr>
                                    <td>Applied Leaves</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <br />
                            <div className="losspay ">
                              <h4>Loss Of Pay</h4>
                              <p>Credited Leaves : </p>
                              <p>Total Leaves : </p>
                              <p>Applied Leaves: </p>
                              <p>Penalty Deduction:</p>
                              <p>Leave Balance:</p>
                            </div>
                          </div>
                          <div
                            className="tab-pane fade"
                            id="profile"
                            role="tabpanel"
                            aria-labelledby="profile-tab"
                          >
                            <div className="table-responsive mt-1">
                              <table
                                id="example1"
                                className="table table-striped wg_allleavelogs"
                                style={{width:"100%"}}
                              >
                                <thead>
                                  <tr>
                                    <th>Leave Type</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Total Days</th>
                                    <th>Applied On</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody></tbody>
                              </table>
                            </div>
                          </div>

                          <div
                            className="tab-pane fade "
                            id="contact"
                            role="tabpanel"
                            aria-labelledby="contact-tab"
                          >
                            <br />
                            <h4>Rule List</h4>
                            <hr />

                            <div className="row">
                              <div className="col-md-3 wrapper shadow bg-white rounded rules">
                                <label>Loss of pay</label>
                                <br /> <strong>Effective Date: </strong>
                                <span>30-08-2020</span>
                              </div>

                              <div className="col-md-8 shadow bg-white rounded">
                                <div className="container my-4">
                                  <div className="row">
                                    <div className="col-xl-12 mb-4 mb-xl-0">
                                      <section>
                                        <ul
                                          className="nav nav-tabs"
                                          id="myTab"
                                          role="tablist"
                                        >
                                          <li className="nav-item waves-effect waves-light">
                                            <a
                                              className="nav-link active"
                                              id="general-tab"
                                              data-toggle="tab"
                                              href="#general"
                                              role="tab"
                                              aria-controls="general"
                                              aria-selected="false"
                                            >
                                              General Settings
                                            </a>
                                          </li>
                                          <li className="nav-item waves-effect waves-light">
                                            <a
                                              className="nav-link "
                                              id="advance-tab"
                                              data-toggle="tab"
                                              href="#advance"
                                              role="tab"
                                              aria-controls="advance"
                                              aria-selected="false"
                                            >
                                              Advance Settings
                                            </a>
                                          </li>
                                        </ul>
                                        <div
                                          className="tab-content"
                                          id="myTabContent"
                                        >
                                          <div
                                            className="tab-pane fade active show"
                                            id="general"
                                            role="tabpanel"
                                            aria-labelledby="general-tab"
                                          >
                                            <h5>
                                              <b>Name</b>
                                            </h5>
                                            <p>Loss of pay</p>
                                            <h5>
                                              <b>Description</b>
                                            </h5>
                                            <p>
                                              This is default system provided
                                              option for all users in case of
                                              low leave balance.
                                            </p>
                                            <hr />
                                            <div className="row">
                                              <div className="col-md-3">
                                                <b>Leaves count</b>
                                              </div>
                                              <div className="col-md-4">
                                                <ul>
                                                  <li>
                                                    <b>
                                                      Weekends between leave
                                                    </b>
                                                  </li>
                                                  <li>
                                                    <p>Not Considered</p>
                                                  </li>
                                                </ul>
                                              </div>
                                              <div className="col-md-4">
                                                <ul>
                                                  <li>
                                                    <b>
                                                      Holidays between leave
                                                    </b>
                                                  </li>
                                                  <li>
                                                    <p>Not Considered</p>
                                                  </li>
                                                </ul>
                                              </div>
                                            </div>
                                            <hr />
                                            <div className="row">
                                              <div className="col-md-3">
                                                <b>Applicability</b>
                                              </div>
                                              <div className="col-md-8">
                                                <ul>
                                                  <li>
                                                    <b>
                                                      Allowed Under Probation
                                                    </b>
                                                  </li>
                                                  <li>
                                                    <p>Yes</p>
                                                  </li>
                                                </ul>
                                              </div>
                                            </div>
                                            <hr />
                                            <div
                                              className="row"
                                              style={{height: "54px"}}
                                            ></div>
                                          </div>

                                          <div
                                            className="tab-pane fade "
                                            id="advance"
                                            role="tabpanel"
                                            aria-labelledby="advance-tab"
                                          >
                                            <div className="row">
                                              <div className="col-md-4">
                                                <b>Miscellaneous</b>
                                              </div>
                                              <div className="col-md-4">
                                                <ul>
                                                  <li>
                                                    <b>
                                                      Backdated Leaves Allowed
                                                    </b>
                                                  </li>
                                                  <li>
                                                    <p>Yes</p>
                                                  </li>
                                                </ul>
                                                <ul>
                                                  <li>
                                                    <b>
                                                      Apply Leaves for Next Year
                                                      Till
                                                    </b>
                                                  </li>
                                                  <li>
                                                    <p>December</p>
                                                  </li>
                                                </ul>
                                              </div>
                                              <div className="col-md-4">
                                                <ul>
                                                  <li>
                                                    <b>
                                                      Backdated Leaves Allowed
                                                      up to
                                                    </b>
                                                  </li>
                                                  <li>
                                                    <p>30 Days</p>
                                                  </li>
                                                </ul>
                                              </div>
                                            </div>
                                            <hr />
                                            <div
                                              className="row"
                                              style={{height: "70px"}}
                                            ></div>
                                          </div>
                                        </div>
                                      </section>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div
                            className="tab-pane fade"
                            id="teamleaves"
                            role="tabpanel"
                            aria-labelledby="teamleaves-tab"
                          >
                            <br />
                            <div className="row input-daterange">
                              <div className="col-sm-8">
                                <div className="row">
                                  <div className="col-sm-5 mb-3">
                                    <fieldset className="form-group">
                                      <div
                                        className="input-group date"
                                        id="from_date"
                                        data-target-input="nearest"
                                      >
                                        <input
                                          type="text"
                                          className="form-control datetimepicker-input"
                                          placeholder="From Date"
                                          name="from_date"
                                          id="from"
                                          data-target="#from_date"
                                        />
                                        <div
                                          className="input-group-append"
                                          data-target="#from_date"
                                          data-toggle="datetimepicker"
                                        >
                                          <div className="input-group-text">
                                            <i className="fa fa-calendar"></i>
                                          </div>
                                        </div>
                                      </div>
                                    </fieldset>
                                  </div>
                                  <div className="col-sm-5 mb-3">
                                    <fieldset className="form-group">
                                      <div
                                        className="input-group date"
                                        id="to_date"
                                        data-target-input="nearest"
                                      >
                                        <input
                                          type="text"
                                          className="form-control datetimepicker-input"
                                          placeholder="To Date"
                                          name="to_date"
                                          id="to"
                                          data-target="#to_date"
                                        />
                                        <div
                                          className="input-group-append"
                                          data-target="#to_date"
                                          data-toggle="datetimepicker"
                                        >
                                          <div className="input-group-text">
                                            <i className="fa fa-calendar"></i>
                                          </div>
                                        </div>
                                      </div>
                                    </fieldset>
                                  </div>
                                  <div className="col-sm-2 mb-3">
                                    <button
                                      type="button"
                                      name="filter"
                                      id="filter"
                                      className="btn btn-primary btn-sm cstm-bg-primary"
                                    >
                                      Filter
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <button
                                  name="wgz_bulk_approve"
                                  className="btn btn-warning btn-sm site-main-btn  leave-btn"
                                  id="wgz_bulk_approve"
                                >
                                  Bulk Approve
                                </button>
                              </div>
                            </div>
                            <br />

                            <div className="table-responsive">
                              <table
                                className="table table-sm mt-4 leave-request-table"
                                id="teamleaveRequestTable"
                              >
                                <thead>
                                  <tr>
                                    <th>
                                      <input type="checkbox" id="ckbCheckAll" />
                                    </th>
                                    <th style={{textAlign: "center"}}>
                                      Employee Name
                                    </th>
                                    <th style={{textAlign: "center"}}>Type</th>
                                    <th style={{textAlign: "center"}}>Reason</th>
                                    <th style={{textAlign: "center"}}>
                                      Start Date
                                    </th>
                                    <th style={{textAlign: "center"}}>
                                      End Date
                                    </th>
                                    <th style={{textAlign: "center"}}>
                                      Applied On
                                    </th>
                                    <th style={{textAlign: "center"}}>Status</th>
                                    <th style={{textAlign: "center"}}>Actions</th>
                                  </tr>
                                </thead>
                                <tbody></tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sidebar-navmenu" id="js-sidebar-navmenu">
              <div className="close-sidebar-navmenu" id="js-close-sidebar-navmenu">
                <i className="fas fa-times"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaves;
