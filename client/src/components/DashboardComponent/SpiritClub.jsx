import React from "react";

const SpiritClub = () => {
  return (
    <>
      <section className="content mt-4 spriit-club">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-primary">
                <div className="card-header">
                  <h3 className="card-title">Spirit Club</h3>
                  <button
                    type="button"
                    className="btn site-main-btn-2 project-btn"
                    style={{float: "right" ,backgroundColor:"white"}}
                  >
                    Create Group <i className="fa fa-plus"></i>
                  </button>
                </div>
                <div className="card-body cstm-table-outer">
              {/* Filters */}
              <div className="row justify-content-between mb-3">
                  <div className='col-sm-12 col-md-6'>
                  <div className='records-per-page'>
                    Show{" "}
                    <select className="custom-select custom-select-sm form-control form-control-sm">
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>{" "}
                    entries
                  </div>
                </div>

                <div className='col-sm-12 col-md-6'>
                  <div className="search-bar">
                    Search:{" "}
                    <input
                    className="form-control form-control-sm"
                      type="text"
                      placeholder="Search employees..."
                    />
                  </div>
                </div>
                </div>
                  
                  <div className="table-responsive mt-1">
                    <table
                      id="example1"
                      className="table table-striped wg_allinterviews"
                    >
                      <thead>
                        <tr>
                          <th className="sorting">S.No </th>
                          <th className="sorting">Employee Name </th>
                          <th className="sorting">Role </th>
                          <th className="sorting">Department </th>
                          <th className="sorting">Choose </th>
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
      <div className="sidebar-navmenu" id="js-sidebar-navmenu">
        <div className="close-sidebar-navmenu" id="js-close-sidebar-navmenu">
          <i className="fas fa-times"></i>
        </div>
      </div>
    </>
  );
};

export default SpiritClub;
