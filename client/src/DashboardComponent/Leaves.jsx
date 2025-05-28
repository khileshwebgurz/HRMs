import React from "react";
import "../assets/css/leaves.css";
const Leaves = () => {
  return (
    <>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>All Leave Logs</h1>
            </div>
          </div>
        </div>
      </section>

      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table
                id="wgz_users_table"
                className="table table-bordered table-striped wg_allusers "
              >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Employee Name</th>
                    <th style={{display: "none"}}>Created at</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Total Leaves</th>
                    <th>Leave Type</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th style={{display: "none"}}>Manager</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade leave-modal"
        id="approvalModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div
              className="modal-header"
              style={{backgroundColor: "#f85697", color: "white"}}
            >
              <h5 className="modal-title" id="exampleModalCenterTitle">
                Get Approval
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form action="" method="post" id="approvalFormManager">
                <input
                  type="hidden"
                  name="get_approval_id"
                  id="get_approval_id"
                  value=""
                />
                @csrf
                <div className="modal-body">
                  <div className="row ">
                    <div className="col-sm-12">
                      <label>Employee Reason:</label>
                      <p className="emreason"></p>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label>Write Your Reason:</label>
                        <textarea
                          className="form-control"
                          id="wgz-notes"
                          rows="5"
                          name="notes"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <input
                    className="btn btn-success wgz-apply-approval-manager site-main-btn"
                    type="submit"
                    name="send"
                    value="Send"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade show"
        id="wgz_bulk_import"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title wgz_title">Leave detail</h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaves;
