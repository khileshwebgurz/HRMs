     {/* 4th section */}

      {/* <section className="content mt-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3">
              <div className="support-ticket-sidebar">
                <ul className="tabs" id="tabs">
                  <li className="tab-link current" data-tab="tab-1">
                    <div className="tab-inner">
                      <span className="tab-name my-tickets">All Tickets</span>
                    </div>
                  </li>
                  <li className="tab-link" data-tab="tab-2">
                    <a href="{{ route('em-support-ticket', 'newticket') }}">
                      <div className="tab-inner">
                        <span className="tab-name new-ticket">New Ticket</span>
                      </div>
                    </a>
                  </li>
                  <li className="tab-link" data-tab="tab-2">
                    <a href="{{ route('em-ticket-system', 'reports') }}">
                      <div className="tab-inner">
                        <span className="tab-name new-ticket">Reports</span>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-9">
              <div className="support-ticket-content">
                <div id="tab-1" className="tab-content current">
                  <div className="card card-primary">
                    <div className="main-header card-header d-flex align-items-center">
                      <h3 className="card-title">My Tickets</h3>
                      <div className="card-actions  d-flex align-items-center">
                        <span
                          className="float-right d-flex align-items-center"
                          id="filter"
                        >
                          <input
                            type="text"
                            className="form-control"
                            name="datefilter"
                            // autocomplete="off"
                            placeholder="Select Filter Date"
                            // readonly
                          />
                        </span>

                        <select id="filterstatus"></select>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="ticket-status d-flex justify-content-end mb-3">
                        <span className="text-green mr-4">
                          <strong></strong> Open Tickets{" "}
                        </span>
                        <span className="text-red">
                          <strong></strong> Close Tickets
                        </span>
                      </div>

                      <div className="table-responsive mt-1">
                        <table className="table wg_allinterviews tickets-table">
                          <thead>
                            <tr>
                              <th>Ticket No</th>
                              <th>Type</th>
                              <th>Work Station Code</th>
                              <th>Level</th>
                              <th>Employee Name</th>
                              <th>Status</th>
                              <th>Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody></tbody>
                        </table>
                      </div>
                    </div>

                    <div className="card-footer"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}