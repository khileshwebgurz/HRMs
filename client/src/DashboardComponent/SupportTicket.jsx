import React from "react";
import "../assets/css/ticket.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import AddTicketForm from "./TicketComponent/AddTicketForm";



const SupportTicket = () => {
  const user = useUser();
  const [tab, setTab] = useState("myticket");
  const [ticketdata, setTicketdata] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const handleTabChange = (val) => {
    setTab(val);
  };

  useEffect(() => {
    getTicket();
  }, []);

  const getTicket = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/ticketViewByEmployee`,
      { withCredentials: true }
    );

    setTicketdata(response.data.data);
    setFilteredTickets(response.data.data);
  };

  useEffect(() => {
    let filtered = [...ticketdata];

    if (statusFilter) {
      filtered = filtered.filter(
        (ticket) => ticket.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (dateFilter) {
      filtered = filtered.filter((ticket) =>
        ticket.created_at.includes(dateFilter)
      );
    }

    setFilteredTickets(filtered);
  }, [statusFilter, dateFilter, ticketdata]);


  return (
    <>
      <section className="content mt-4 support-ticket">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3">
              <div className="support-ticket-sidebar">
                <ul className="tabs">
                  <li
                    onClick={() => handleTabChange("myticket")}
                    className="tab-link current"
                    data-tab="tab-1"
                  >
                    <div className="tab-inner">
                      <span className="tab-name my-tickets">My Tickets</span>
                    </div>
                  </li>
                  <li
                    onClick={() => handleTabChange("newticket")}
                    className="tab-link"
                    data-tab="tab-2"
                  >
                    <Link to="">
                      <div className="tab-inner">
                        <span className="tab-name new-ticket">New Ticket</span>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            {tab === "myticket" && (
              <div className="col-lg-9">
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
                              type="date"
                              className="form-control"
                              placeholder="Filter by date (YYYY-MM-DD)"
                              value={dateFilter}
                              onChange={(e) => setDateFilter(e.target.value)}
                            />
                          </span>

                          <select
                            id="changestatus"
                            className="form-control"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                          >
                            <option value="">All Status</option>
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive mt-1">
                          <table className="table m wg_allinterviews tickets-list">
                            <thead>
                              <tr>
                                <th>Ticket ID</th>
                                <th>Created At</th>
                                <th>Issue Type</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Employee</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredTickets?.length > 0 ? (
                                filteredTickets.map((ticket, index) => (
                                  <tr key={ticket.id}>
                                    <td>{ticket.ticket_id}</td>
                                    <td>{ticket.created_at}</td>
                                    <td>{ticket.issue_type}</td>
                                    <td>{ticket.description}</td>
                                    <td>{ticket.status}</td>
                                    <td className="d-flex align-items-center">
                                      <img
                                        src={ticket.employee_image}
                                        alt="emp"
                                        width="30"
                                        height="30"
                                        className="rounded-circle me-2"
                                      />
                                      {ticket.employee_name}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="6" className="text-center">
                                    No tickets found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="card-footer"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "newticket" && (
              <AddTicketForm
                userRole={user.role_id}
                currentUserId={user.id}
                refreshTickets={getTicket}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default SupportTicket;
