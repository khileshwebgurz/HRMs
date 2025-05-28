import React from "react";

const HelpDesk = () => {
  return (
    <>
      <section className="content mt-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-primary helpDesk-show">
                <div className="card-header salary-slip-header d-flex justify-content-between align-items-center">
                  <h3 className="card-title">Help Desk</h3>
                  <a
                    href="{{ route('helpdesk-add') }}"
                    className="btn btn-primary site-main-btn-2"
                  >
                    <i className="fa fa-plus"></i> Add
                  </a>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped wg_salaryslip border-collapse">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Question</th>

                          <th>Category</th>
                          <th>Created By</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody></tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* search blade */}

      <section className="content mt-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="helpDesk-card">
                <div className="helpDesk-logo">
                  <img
                    src="{{ asset('dist/img/webguruz-logo-blue.png') }}"
                    alt="Webguruz Logo"
                  />
                </div>
                <div className="form-outline helpDesk-search">
                  <input
                    type="search"
                    id="search"
                    name="search"
                    className="form-control search"
                    placeholder="Type query"
                    aria-label="Search"
                  />
                  <ul id="ul" type="none" className="helpDesk-dropdown"></ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="sidebar-navmenu" id="js-sidebar-navmenu">
        <div className="close-sidebar-navmenu" id="js-close-sidebar-navmenu">
          <i className="fas fa-times"></i>
        </div>
      </div>
    </>
  );
};

export default HelpDesk;
