import React from "react";
import { Link } from "react-router-dom";
const VendorManagement = () => {
  return (
    <>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>All Vendors</h1>
            </div>
            <div className="col-sm-6 text-right custom-btn-grp">
              <Link
                to=""
                className="btn btn-success btn-sm site-main-btn-2"
              >
                <i className="fas fa-plus"></i> Add New Vendor
              </Link>
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
                className="table table-bordered table-striped wg_allusers"
              >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone No</th>
                    <th>Company Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorManagement;
