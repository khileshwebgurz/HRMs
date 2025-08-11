import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { Link } from "react-router-dom";
const viewInterview = () => {
  const user = useUser();
  const [data, setData] = useState([]);
  const [itemsPerPage, setItemPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const statusMap = {
    round1: "1",
    round2: "2",
    round3: "3",
    final: "4",
    offered: "5",
    rejected: "6",
  };


  const fetchData = async (
    page = 1,
    term = searchTerm,
    limit = itemsPerPage
  ) => {
    const res = await axios.get(
      `http://localhost:8000/api/all-interviews?page=${page}&limit=${limit}&search=${encodeURIComponent(
        term
      )}`,
      {
        params: {
          status: statusMap[statusFilter] || "",
        },
        withCredentials: true,
      }
    );
    setData(res.data.data);
    setTotalPages(res.data.last_page);
  };
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, statusFilter, itemsPerPage]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchData(1, searchTerm);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleRecordsPerPage = (e) => {
    setItemPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // console.log('the data is >>',data)
  return (
    <>
      {user.user_role !== "1" ? (
        <>
          <section className="content-header all-candidate-page">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-4">
                  <h1>All Interviews</h1>
                </div>
              </div>
            </div>
          </section>
          <div className="container-fluid">
            <div className="card all-user-card">
              <div className="card-body">
                <h5>
                  Sorry!You don't have permission to view. Please Contact Hr
                </h5>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>All Interviews</h1>
                  <div>
                    Show{" "}
                    <select
                      value={itemsPerPage}
                      onChange={handleRecordsPerPage}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>{" "}
                    entries
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="form-control my-3"
                  />
                </div>
                <select
                  id="changestatus"
                  className="form-control ml-2"
                  value={statusFilter}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setStatusFilter(e.target.value);
                  }}
                >
                  <option value="">All Status</option>
                  <option value="round1">Round 1</option>
                  <option value="round2">Round 2</option>
                  <option value="round3">Round 3</option>
                  <option value="final">Final</option>
                  <option value="offered">Offered</option>
                  <option value="rejected">Rejected</option>
                </select>
                <div className="col-sm-6 text-right"></div>
              </div>
            </div>
          </section>

          <div className="card interview-card">
            <div className="card-body">
              <div className="table-responsive">
                <table
                  id="example1"
                  className="table table-striped wg_allusers"
                >
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Candidate Name</th>
                      <th>Candidate Email</th>
                      <th>Candidate Phone</th>
                      <th>Date/Time</th>
                      <th>Interview Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.length > 0 ? (
                      data.map((result, index) => (
                        <tr key={result.id}>
                          <td>{index + 1}</td>
                          <td>{result.candidate_name}</td>
                          <td>{result.candidate_email}</td>
                          <td>{result.candidate_phone}</td>
                          <td>{result.interview_time}</td>
                          <td>{result.interview_status}</td>
                          <td>
                            <Link to={`/public/interview/view/${result.id}`}>
                              <i className="fas fa-eye"></i>
                            </Link>
                            {/* <i className="fas fa-eye"></i> */}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No candidates found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div className="d-flex justify-content-between align-items-center">
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-outline-secondary me-2"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                      Prev
                    </button>

                    {/* {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`btn me-2 ${
                currentPage === i + 1 ? "btn-primary" : "btn-outline-secondary"
              }`}
              disabled={currentPage === i + 1}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))} */}

                    <button
                      className="btn btn-outline-secondary"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default viewInterview;
