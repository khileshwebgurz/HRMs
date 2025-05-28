import React from "react";
import '../assets/css/directory.css'
// import '../../public/plugins/datatables-bs4/css/dataTables.bootstrap4.min.css'                    
import '../../public/plugins/datatables-responsive/css/responsive.bootstrap4.min.css'
import '../../public/plugins/datatables-buttons/css/buttons.bootstrap4.min.css'
import '../../public/css/fixedColumns.dataTables.min.css'
import '../../public/css/sweetalert2.min.css'

const Directory = () => {
  return (
    <>
      <section className="content mt-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-primary directory-card">
                <div className="card-header">
                  <h3 className="card-title">Directory </h3>
                  {/* <?php
						$employees = App\ObCandidates::count();
						?> */}
                  <h5 style={{textAalign: "right",fontSize: "17px"}}>
                    <figure>
                      {/* <img src="{{asset('dist/img/2021/icons/buisnessmen.png')}} " /> */}
                    </figure>
                    {/* No. of Employees: {{ $employees }} */}
                    No. of Employees: 40

                  </h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive_">
                    <table
                      id="wgz_users_table"
                      className="table table-striped wg_allinterviews table-responsive"
                    >
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Employee Id</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Designation</th>
                          <th>Department</th>
                          <th>Manager</th>
                          <th>Location</th>
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
    </>
  );
};

export default Directory;
