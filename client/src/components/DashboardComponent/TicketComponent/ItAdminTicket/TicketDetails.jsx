import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
const TicketDetails = () => {
  const { ticketID } = useParams();
  const [ticketdetail, setTicketdetail] = useState([]);
  const fetchTicketDetail = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/ticket/detail/${ticketID}`,
      { withCredentials: true }
    );
    setTicketdetail(res.data);
  };

  useEffect(() => {
    fetchTicketDetail();
  }, []);

  if (!ticketdetail || !ticketdetail.employee) {
    return <div>Loading...</div>;
  }

  console.log("my ticket detail is >>>", ticketdetail?.employee?.employee?.name);

  return (
    <section className="content mt-4 support-ticket">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3">
            <div className="support-ticket-sidebar">
              <ul className="tabs">
                <li className="tab-link current" data-tab="tab-1">
                  <Link to="/employee/ticket-system/alltickets">
                    <div className="tab-inner">
                      <span className="tab-name my-tickets">All Tickets</span>
                    </div>
                  </Link>
                </li>
                <li className="tab-link" data-tab="tab-2">
                  <Link to="/employee/support-ticket/newticket">
                    <div className="tab-inner">
                      <span className="tab-name new-ticket">New Ticket</span>
                    </div>
                  </Link>
                </li>
                <li className="tab-link" data-tab="tab-2">
                  <Link to="/employee/ticket-system/reports">
                    <div className="tab-inner">
                      <span className="tab-name new-ticket">Reports</span>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="user-items">
              <ul className="list-unstyled m-0">
                <li>
                  <span>Employee Name:</span>
                  {ticketdetail?.employee?.employee?.name}
                </li>
                <li>
                  <span className="user-id">#IMS:</span>
                  {ticketdetail?.ticket.id}
                </li>
                <li>
                  <span>Employee Workstation Number:</span>
                  {ticketdetail?.employee?.employee?.id}
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-9">
            <div className="support-ticket-content">
              <div className="card card-primary">
                <div className="main-header card-header d-flex align-items-center">
                  <h3 className="card-title">Ticket Detail</h3>
                </div>

                <div className="card-body">
                  <div className="ticket-details-sec">
                    <div className="ticket-status d-flex justify-content-end mb-3">
                      <span className="text-green mr-4">
                        <strong>{ticketdetail?.employee?.open_count}</strong> Open
                        Tickets
                      </span>
                      <span className="text-red">
                        <strong>{ticketdetail?.employee?.close_count}</strong>{" "}
                        Closed Tickets
                      </span>
                    </div>

                    <div className="tickets-list">
                      <div className="card-outer">
                        <div className="card">
                          <div className="card-body p-0">
                            <div className="card-header p-0 mb-3">
                              <div className="card-title">
                                <h5>
                                  <span>ID:</span> {ticketdetail?.ticket.id}
                                </h5>
                              </div>
                            </div>
                            <div className="card-content mb-3">
                              <div className="card-content-inner">
                                <div className="card-text mb-2">
                                  <strong>Type:</strong> {ticketdetail?.issue}
                                </div>

                                <div className="card-desc">
                                  <strong>Description:</strong>{" "}
                                  {ticketdetail?.ticket?.description}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="card-footer p-0">
                            <div className="card-footer-content">
                              <span className="float-left">
                                <i className="far fa-clock mr-2"></i>{" "}
                                {ticketdetail?.ticket?.created_at.slice(0, 10)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="ticket-comment mt-4">
                          <h6 className="heading">Replies</h6>
                          <ul className="list-unstyled mt-3">
                            {ticketdetail?.employee?.replies?.length > 0 ? (
                              ticketdetail.employee.replies.map(
                                (reply, index) => (
                                  <li
                                    key={index}
                                    className="mb-3 border-bottom pb-2"
                                  >
                                    <p className="mb-1">
                                      <strong>Reply:</strong>{" "}
                                      {reply.reply_message}
                                    </p>
                                    <p
                                      className="mb-0 text-muted"
                                      style={{ fontSize: "0.875rem" }}
                                    >
                                      {new Date(
                                        reply.created_at
                                      ).toLocaleString()}
                                    </p>
                                  </li>
                                )
                              )
                            ) : (
                              <li>No replies found.</li>
                            )}
                          </ul>
                        </div>

                        <div className="card-action-buttons mt-3">
                          <button className="btn btn-sm btn-info">
                            Resolved
                          </button>
                          <button
                            className="btn btn-sm btn-secondary ml-2"
                            disabled
                          >
                            Mark as Resolved
                          </button>

                          <div className="mt-4">
                            <form>
                              <div className="mb-3">
                                <label className="form-label text-secondary">
                                  Reply to Ticket #{}
                                </label>
                                <textarea
                                  name="reply"
                                  className="form-control"
                                  rows="5"
                                  placeholder="Enter Your Reply Here"
                                  required
                                ></textarea>
                              </div>
                              <input
                                className="btn btn-sm btn-info"
                                type="submit"
                                value="Submit"
                              />
                              <button
                                type="button"
                                className="btn btn-sm btn-secondary ml-2"
                              >
                                Cancel
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>{" "}
                      {/* card-outer */}
                    </div>
                  </div>
                </div>
              </div>{" "}
              {/* .card */}
            </div>
          </div>
        </div>
      </div>
    </section>
   
  );
};

export default TicketDetails;
