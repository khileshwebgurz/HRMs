 {/* 2nd section */}
      {/* <section className="content mt-4 support-ticket">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3">
              <div className="support-ticket-sidebar">
                <ul className="tabs">
                  <li className="tab-link current" data-tab="tab-1">
                    <a href="{{route('em-ticket-system', 'alltickets')}}">
                      <div className="tab-inner">
                        <span className="tab-name my-tickets">All Tickets</span>
                      </div>
                    </a>
                  </li>
                  <li className="tab-link" data-tab="tab-2">
                    <a href="{{ route('em-support-ticket', 'newticket') }}">
                      <div className="tab-inner">
                        <span className="tab-name new-ticket">New Ticket</span>
                      </div>
                    </a>
                  </li>
                  <li className="tab-link" data-tab="tab-2">
                    <a href="{{route('em-ticket-system', 'reports')}}">
                      <div className="tab-inner">
                        <span className="tab-name new-ticket">Reports</span>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="user-items">
                <ul className="list-unstyled m-0">
                  <li>
                    <span>Employee Name:</span>
                  </li>
                  <li>
                    <span className="user-id">#IMS:</span>
                  </li>
                  <li>
                    <span>Employee Workstation Number:</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-9">
              <div className="support-ticket-content">
                <div id="tab-1" className="tab-content current">
                  <div className="card card-primary">
                    <div className="main-header card-header d-flex align-items-center">
                      <h3 className="card-title">Ticket Detail</h3>
                    </div>

                    <div className="card-body">
                      <div className="ticket-details-sec">
                        <div className="ticket-status d-flex justify-content-end mb-3">
                          <span className="text-green mr-4">
                            <strong></strong> Open Tickets{" "}
                          </span>
                          <span className="text-red">
                            <strong></strong> Close Tickets
                          </span>
                        </div>
                        <div className="tickets-list">
                          <div className="card-outer">
                            <div className="card">
                              <div className="card-body p-0">
                                <div className="card-header p-0 mb-3">
                                  <div className="card-title">
                                    <h5 className="card-title">
                                      <span>ID :</span> #IMS-{" "}
                                    </h5>
                                  </div>
                                </div>
                                <div className="card-content mb-3">
                                  <div className="card-content-inner">
                                    <div className="card-text mb-2"></div>
                                    <div className="card-desc"></div>
                                  </div>
                                </div>
                              </div>
                              <div className="card-footer p-0">
                                <div className="card-footer-content">
                                  <span className="float-left">
                                    <span className="icon mr-2">
                                      <i className="far fa-clock"></i>
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="ticket-comment">
                              <h6 className="heading">Replies</h6>
                              <ul className="list-unstyled mt-3"></ul>
                            </div>

                            <div className="card-action-buttons">
                              <a
                                href="{{ route('em-ticket-update-status2', $ticket->id) }}"
                                data-id="'.$row->id.'"
                                id="resolved"
                                className="btn btn-sm btn-info"
                              >
                                Resolved
                              </a>

                              <button
                                className="btn btn-sm btn-info"
                                id="loader"
                                type="button"
                                disabled
                              >
                                <span
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Loading...
                              </button>

                              <div id="myDIV" className="mt-3">
                                <form
                                  encType="multipart/form-data"
                                  id="problem"
                                >
                                  <div className="mb-3">
                                    <label className="form-label text-secondary">
                                      ID: #IMS-{" "}
                                    </label>
                                    <input
                                      type="hidden"
                                      name="ticketid"
                                      value="{{ $ticket->id }}"
                                    />
                                    <textarea
                                      type="text"
                                      name="reply"
                                      id="reply"
                                      className="form-control"
                                      rows="5"
                                      cols="2"
                                      placeholder="Enter Your Reply Here"
                                      required
                                    ></textarea>
                                  </div>
                                  <input
                                    className="btn btn-sm btn-info"
                                    type="submit"
                                    value="Submit"
                                    id="submit"
                                    name="submit"
                                  />
                                  <a
                                    href="#"
                                    className="btn btn-sm btn-info"
                                    id="cancel"
                                  >
                                    Cancel
                                  </a>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}