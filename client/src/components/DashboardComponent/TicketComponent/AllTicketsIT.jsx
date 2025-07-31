import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
const AllTicketsIT = () => {
  const { name } = useParams();

  const [alltickets, setAllTickets] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [dateFilter, setDateFilter] = useState("");
  // Map status labels to DB values
  const statusMap = {
    Open: "1",
    Closed: "2",
    "In Progress": "3",
  };


  const fetchAllTickets = async (pageNumber = 1) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/ticket-system/${name}`,
        {
          params: {
            page: pageNumber,
            per_page: 5,
            status: statusMap[statusFilter] || "",
            datefilter: dateFilter,
          },
          withCredentials: true,
        }
      );
      setAllTickets(res.data);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    }
  };

  console.log("my all tickets data is >>>>", alltickets);
  useEffect(() => {
    fetchAllTickets(page);
  }, [page, statusFilter, dateFilter]);

  const handlePageChange = (newPage) => {
    if (newPage !== page && newPage > 0 && newPage <= pagination.last_page) {
      setPage(newPage);
    }
  };

  console.log("my date filter is >>>>", dateFilter);

  return (
    <>
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
                <Link to="/employee/support-ticket/newticket">
                  <div className="tab-inner">
                    <span className="tab-name new-ticket">New Ticket</span>
                  </div>
                </Link>
              </li>
              <li className="tab-link" data-tab="tab-2">
                <a href="/reports">
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
                  <div className="card-actions d-flex align-items-center">
                    <DatePicker
                      selectsRange={true}
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(update) => {
                        setDateRange(update);
                        if (update[0] && update[1]) {
                          setDateFilter(
                            `${update[0].toISOString().split("T")[0]} - ${
                              update[1].toISOString().split("T")[0]
                            }`
                          );
                        }
                      }}
                      className="form-control"
                      placeholderText="YYYY-MM-DD - YYYY-MM-DD"
                    />

                    <select
                      id="changestatus"
                      className="form-control ml-2"
                      value={statusFilter}
                      onChange={(e) => {
                        setPage(1);
                        setStatusFilter(e.target.value);
                      }}
                    >
                      <option value="">All Status</option>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="card-body">
                  <div className="ticket-status d-flex justify-content-end mb-3">
                    <span className="text-green mr-4">
                      <strong>{alltickets.open_count || 0}</strong> Open Tickets
                    </span>
                    <span className="text-red">
                      <strong>{alltickets.close_count || 0}</strong> Close
                      Tickets
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
                      <tbody>
                        {alltickets?.tickets?.length > 0 ? (
                          alltickets.tickets.map((ticket, id) => (
                            <tr key={id}>
                              <td>{ticket.ticket_no}</td>
                              <td>{ticket.issue_type}</td>
                              <td>{ticket.work_station}</td>
                              <td>{ticket.issue_level}</td>
                              <td>{ticket.employee_name}</td>
                              <td>{ticket.status}</td>
                              <td>{ticket.created_at}</td>
                              <td>
                                {/* Replace with your action link if needed */}
                                <a href={`/ticket/${ticket.id}`}>
                                  <i className="fas fa-eye"></i>
                                </a>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="text-center">
                              No tickets found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    <div className="pagination-controls d-flex justify-content-between mt-3">
                      <button
                        disabled={page <= 1}
                        onClick={() => handlePageChange(page - 1)}
                        className="btn btn-secondary btn-sm"
                      >
                        Previous
                      </button>
                      <span>
                        Page {page} of {pagination.last_page || 1}
                      </span>
                      <button
                        disabled={page >= pagination.last_page}
                        onClick={() => handlePageChange(page + 1)}
                        className="btn btn-secondary btn-sm"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card-footer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllTicketsIT;
