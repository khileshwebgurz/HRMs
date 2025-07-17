import React from "react";
import { Link } from "react-router-dom";
const EmployeeDashboard = ({user}) => {
    console.log('user insdie employee dashboard ?>>>',user)
  return (
    <>
      <section className="content mt-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="important-notification">
                <div className="notification-subject">
                  <span>
                    <i className="fas fa-envelope-open-text"></i>
                  </span>
                  Tasks and Notifications
                </div>
                <div className="notification-info">
                  No tasks available currently
                </div>
              </div>
              <div className="card card-primary dashboard-main">
                <div className="card-body">
                  <div className="dashboard-options dashboard-options-2">
                    <div className="row">
                      <div className="col-md-3 col-6">
                        <div className="dashboard-option option-1">
                          <Link to="/directory">
                            <div className="option-icon">
                              <i className="far fa-address-book"></i>
                            </div>
                            <h6 className="option-name">Directory</h6>
                          </Link>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="dashboard-option option-2">
                          <Link to="/employee/attendance">
                            <div className="option-icon">
                              <i className="far fa-calendar-alt"></i>
                            </div>
                            <h6 className="option-name">Attendance</h6>
                          </Link>
                        </div>
                      </div>

                      <div className="col-md-3 col-6">
                        <div className="dashboard-option option-3">
                          <Link to="/companyProfile">
                            <div className="option-icon">
                              <i className="far fa-building"></i>
                            </div>
                            <h6 className="option-name">Company Profile</h6>
                          </Link>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="dashboard-option option-4">
                          <Link to="/importantdates">
                            <div className="option-icon">
                              <i className="far fa-clock"></i>
                            </div>
                            <h6 className="option-name">
                              Event &amp; Important Dates
                            </h6>
                          </Link>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="dashboard-option option-5">
                          <Link to="/myprofile">
                            <div className="option-icon">
                              <i className="far fa-id-badge"></i>
                            </div>
                            <h6 className="option-name">My Profile</h6>
                          </Link>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="dashboard-option option-6">
                          <Link to="/leaves">
                            <div className="option-icon">
                              <i className="far fa-file-alt"></i>
                            </div>
                            <h6 className="option-name">Leaves</h6>
                          </Link>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="dashboard-option option-7">
                          <Link to="/teamchart">
                            <div className="option-icon">
                              <i className="fas fa-sitemap"></i>
                            </div>
                            <h6 className="option-name">Team Chart</h6>
                          </Link>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="dashboard-option option-8">
                          <Link to="/spiritclub">
                            <div className="option-icon">
                              <i className="fas fa-users"></i>
                            </div>
                            <h6 className="option-name">Spirit Club</h6>
                          </Link>
                        </div>
                      </div>

                      {user.role_id === 3 ? (
                        <div className="col-md-3 col-6">
                          <div className="dashboard-option option-9">
                            <a href="{{ route('em-ticket-system', 'alltickets') }}">
                              <div className="option-icon">
                                {/* <?php $open_c = App\Tickets::where('status', '1')->count(); $progress_c = App\Tickets::where('status', '3')->count(); $open_count = $open_c + $progress_c;?> */}
                                <i className="fas fa-users"></i>

                                {/* <span className="badge badge-pill badge-danger">{{$open_count }}</span> */}
                              </div>
                              <h6 className="option-name">WIMS</h6>
                            </a>
                          </div>
                        </div>
                      ) : user.id !== 1 ? (
                        <div className="col-md-3 col-6">
                          <div className="dashboard-option supportTicket">
                            <Link to="/supportticket">
                              <div className="option-icon">
                                {/* <?php $emp_open = App\Tickets::where('employee_id', Auth::user()->id)->where('status', '1')->count(); $emp_progress = App\Tickets::where('employee_id', Auth::user()->id)->where('status', '3')->count(); $emp_count = $emp_open + $emp_progress;?> */}
                                <i className="fas fa-users"></i>

                                {/* <span className="badge badge-pill badge-danger">{{$emp_count }}</span> */}
                              </div>
                              <h6 className="option-name">Support Ticket</h6>
                            </Link>
                          </div>
                        </div>
                      ) : null}

                      <div className="col-md-3 col-6">
                        <div className="dashboard-option option-10">
                          <Link to="/helpdesk">
                            <div className="option-icon">
                              <svg
                                version="1.1"
                                id="Layer_1"
                                width="90"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                style={{ enableBackground: "new 0 0 512 512" }}
                                x="0px"
                                y="0px"
                                viewBox="0 0 80 80"
                                xmlSpace="preserve"
                              >
                                <style type="text/css"></style>
                                <g>
                                  <path
                                    className="st0"
                                    d="M21.6,37c-0.1-0.3-0.3-0.6-0.4-0.8c-2.1-4.5-2.9-9.3-1.9-14.2c0.8-4.2,3.3-6.5,7.5-7.2
                                                              c3.1-0.5,6.2-0.6,9.3,0.3c4,1.2,6.3,3.9,6.8,7.9c0.8,5.2-0.3,10.2-3,14.7c-1.3,2.1-3,4-5.3,5c-3,1.3-6,1.1-8.6-0.9
                                                              c-1.2-0.9-2.1-2-3.2-3.1c-0.2-0.2-0.6-0.5-0.9-0.5c-3.8-0.7-5.5-2.2-6.4-6c0-0.2-0.1-0.3-0.2-0.6c-0.5,0-0.9,0-1.3,0
                                                              c-1.3,0-1.9-0.8-2-1.9c0-1.8,0-3.7,0-5.6c0-1.1,0.8-1.8,1.8-1.8c1.2-0.1,1.2-0.1,1.4-1.3c1.3-6.2,4.6-10.7,10.5-13
                                                              c6.8-2.7,14.6,0.3,18.6,6.8c1.3,2,2,4.1,2.4,6.6c0.1,0.7,0.3,1,1.1,1c1.1,0,1.8,0.8,1.8,1.8c0,1.8,0,3.8,0,5.6
                                                              c0,1.1-0.8,1.8-1.8,1.8c-0.8,0-1.5,0-2.2,0c-1.1,0-1.7-0.8-1.8-1.8c0-1.9,0-3.9,0-5.7c0-0.3,0-0.6,0.2-0.8c0.6-0.7,0.5-1.3,0.3-2.1
                                                              c-1.2-5.8-5.4-10.3-10.9-11.4c-4.8-1-8.9,0.7-12,4.2c-2.2,2.4-3.4,5.3-3.8,8.5c0,0.1-0.1,0.2,0,0.3c0.9,2,0.3,4.2,0.5,6.4
                                                              c0,0.1,0,0.2,0,0.3c0,0.8-0.3,1.4-0.9,1.8c-0.2,0.1-0.4,0.4-0.3,0.7c0.2,2.2,2.2,4.4,4.4,4.8C21.3,37.1,21.4,37.1,21.6,37z
                                                              M25.3,38.2c0.8,0.7,1.3,1.3,2,1.8c2.4,1.7,5.1,1.7,7.3-0.1c1.1-0.9,2-1.9,2.8-3.1c2.4-3.7,3.3-7.9,3-12.2c0-0.3-0.3-0.6-0.5-0.7
                                                              c-1.2-0.5-2.4-0.9-3.7-1.3c-1.4-0.4-2.8-0.4-4.1,0.6c-1.1,0.8-1.7,0.7-2.9-0.1c-0.9-0.7-1.7-1-2.8-0.7c-1.6,0.4-3.3,1-4.9,1.5
                                                              c-0.2,0.1-0.4,0.5-0.4,0.8c0,1.2,0,2.3,0.1,3.6c0.3,2.9,1.2,5.7,2.7,8.3c0.1,0.2,0.4,0.5,0.6,0.5c0.7-0.2,1.3-0.4,1.8-0.7
                                                              c0.2-0.1,0.2-0.7,0.3-1.1c0-0.2,0.1-0.4,0.2-0.6c0.6-1.3,2.1-1.9,3.4-1.3c1.3,0.7,1.8,2.2,1.1,3.5c-0.7,1.3-2.3,1.6-3.6,0.9
                                                              c-0.3-0.2-0.7-0.3-0.9-0.3C26.4,37.6,25.9,37.9,25.3,38.2z M22.1,21c1.1-0.3,1.9-0.6,2.9-0.9c1.9-0.5,3.9-0.5,5.6,0.8
                                                              c0.2,0.1,0.7,0,0.9-0.1c1.3-0.9,2.7-1.1,4.2-0.8c1.3,0.3,2.5,0.6,3.8,1c-0.9-1.8-2.4-2.8-4.1-3.4c-2.5-0.8-5-0.7-7.5-0.4
                                                              c-1.2,0.2-2.3,0.6-3.5,1.1C23.3,18.7,22.7,19.8,22.1,21z M15.5,25.2c-0.1-0.1-0.2-0.1-0.2-0.2c-0.3,0.2-0.7,0.3-0.7,0.5
                                                              c-0.1,1.3-0.1,2.5,0,3.7c0,0.1,0.3,0.4,0.5,0.4s0.5-0.2,0.5-0.4C15.5,27.8,15.5,26.5,15.5,25.2z M47.2,29.4c0-1.3,0-2.5,0-3.8
                                                              c0-0.2-0.3-0.4-0.4-0.6c-0.2,0.2-0.5,0.4-0.5,0.6c-0.1,1.1,0,2.1,0,3.1C46.3,29.5,46.6,29.6,47.2,29.4z"
                                  />
                                  <path
                                    className="st0"
                                    d="M28,52.5c-0.4-1.5-0.8-3.1-1.1-4.6c-0.3-1.3,0.4-2,1.6-2.1c1.6,0,3.2,0,4.8,0c1.3,0,1.8,0.8,1.6,2
                                                              c-0.3,1.5-0.7,3.2-1,4.7c0.1-0.2,0.3-0.4,0.4-0.7c0.6-1.3,1.2-2.6,1.7-3.9c0.6-1.3,1.5-1.9,3.1-1.9c3.1,0,6.2,0,9.3,0
                                                              c2.5,0,4.1,1.2,5.1,3.4c2.3,5.2,4.5,10.4,7,15.5c1.8,3.7-0.5,7.7-5,7.6c-5.9-0.1-11.8,0-17.6,0c-10.5,0-21,0-31.5,0
                                                              c-1.1,0-2.1-0.2-3-0.7c-2.4-1.2-3.2-4-2.1-6.5c1.4-3.2,2.8-6.3,4.2-9.4c1-2.2,2-4.4,3-6.6c1-2.2,2.7-3.3,5.1-3.3c3.1,0,6.1,0,9.2,0
                                                              c1.5,0,2.5,0.7,3.2,2c0.6,1.3,1.2,2.5,1.7,3.9C27.7,52.2,27.8,52.4,28,52.5C28,52.6,28,52.6,28,52.5z M30.9,65.5
                                                              c-0.2-0.4-0.3-0.5-0.3-0.7c-2.3-5.1-4.6-10.2-6.8-15.4c-0.3-0.7-0.6-0.9-1.3-0.9c-3,0-6,0-9.1,0c-1.3,0-2.1,0.6-2.7,1.7
                                                              C8.3,55.7,5.9,61,3.6,66.4c-0.1,0.3-0.3,0.6-0.3,0.9c-0.2,1.5,1,2.8,2.7,2.8c5.1,0,10.2,0,15.4,0c11.5,0,23,0,34.5,0
                                                              c1.9,0,3.5-1.7,2.5-3.9C56,61,53.7,55.7,51.3,50.4c-0.6-1.3-1.4-1.9-2.8-1.8c-3,0-6.1,0-9.1,0c-0.6,0-0.9,0.2-1.2,0.8
                                                              c-1.3,3-2.7,6-4,9.1C33.1,60.7,32.1,63,30.9,65.5z M30.9,47c-0.8,0-1.5,0-2.2,0c-0.6,0-0.8,0.2-0.7,0.8c0.3,1.2,0.5,2.2,0.8,3.4
                                                              c0.1,0.3,0.5,0.6,0.7,0.6c0.9,0.1,1.8,0.1,2.7,0c0.3,0,0.6-0.3,0.7-0.6c0.3-1.2,0.5-2.3,0.8-3.5c0.1-0.6-0.1-0.7-0.6-0.7
                                                              C32.5,47,31.7,47,30.9,47z M30.9,59.5c0.8-1.7,1.5-3.3,2.1-4.9c0.3-0.9-0.2-1.4-1.2-1.4c-0.7,0-1.3,0-1.9,0c-1,0-1.5,0.7-1.2,1.6
                                                              C29.5,56.3,30.2,57.7,30.9,59.5z"
                                  />
                                  <path
                                    className="st0"
                                    d="M66,25.6c3.3,0,6.6,0,9.8,0c0.7,0,1.3,0.3,1.9,0.5c1,0.5,1.4,1.3,1.4,2.3c0,4.8,0,9.6,0,14.5
                                                              c0,1.3-0.6,2.1-1.7,2.5c-0.9,0.3-1.7,0.5-2.7,0.5c-5.9,0-11.8,0.1-17.7,0c-1,0-2-0.3-3-0.7c-1-0.4-1.4-1.2-1.3-2.2
                                                              c0-0.3,0-0.6,0-0.8c0.4-1.8-0.4-3-2-3.9c-1.3-0.7-2.3-1.6-3.5-2.4c-0.5-0.4-0.9-0.8-0.7-1.4c0.2-0.7,0.8-0.9,1.4-0.9
                                                              c1.3,0,2.6-0.1,4-0.1c0.6,0,0.9-0.2,0.9-0.8c0-1.3,0-2.4,0-3.7c0-2.3,1-3.4,3.3-3.5c2-0.1,4-0.1,6-0.1C63.4,25.6,64.8,25.6,66,25.6
                                                              L66,25.6z M52.1,36c0,0.1-0.1,0.1-0.1,0.2c0.8,0.6,1.6,1.2,2.5,1.7c0.7,0.4,0.9,1,0.9,1.6c0,0.8,0,1.6,0,2.4c0,1.3,0.1,1.3,1.3,1.4
                                                              c0.2,0,0.4,0,0.7,0c5.9,0,11.7,0,17.5,0c0.4,0,0.7,0,1.1-0.1c0.6-0.1,0.9-0.4,0.9-1.1c0-4.1,0-8.2,0-12.3c0-2,0-2.1-2.1-2.1
                                                              c-5.8,0-11.5,0-17.3,0c-0.4,0-0.8,0.1-1.2,0.1c-0.7,0-1,0.4-1,1.2c0.1,1.7,0,3.5,0,5.1c0,1.3-0.4,1.6-1.7,1.6
                                                              C53.1,36,52.6,36,52.1,36z"
                                  />
                                </g>
                              </svg>
                            </div>
                            <h6 className="option-name">Help Desk</h6>
                          </Link>
                        </div>
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

export default EmployeeDashboard;
