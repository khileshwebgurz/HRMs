import React from "react";

const SpiritClub = () => {
  return (
    <>
      <section className="content mt-4">
        <div className="container-fluid">
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
                <div className="card-body">
                  <div className="table-responsive mt-1">
                    <table
                      id="example1"
                      className="table table-striped wg_allinterviews"
                    >
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Employee Name</th>
                          <th>Role</th>
                          <th>Department</th>
                          <th>Choose</th>
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
