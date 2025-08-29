import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";

const viewInterview = () => {
  const user = useUser();
  const [data, setData] = useState([]);
  const [itemsPerPage, setItemPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const [checked, setChecked] = useState([]);

  // date filter
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [dateFilter, setDateFilter] = useState("");

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
      `${import.meta.env.VITE_API_BASE_URL}/all-interviews`,
      {
        params: {
          page,
          limit,
          search: term,
          datefilter: dateFilter,
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
  }, [currentPage, statusFilter, itemsPerPage, dateFilter]);

  const handleCheckboxChange = (id) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  // for selectall checkbox
  const handleCheckAll = (e) => {
    if (e.target.checked) {
      const allIds = data.map((c) => c.id);

      setChecked(allIds);
    } else {
      setChecked([]);
    }
  };
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

  // function to set filter for today
  const handleTodayFilter = () => {
    const today = new Date();
    const formatted = today.toISOString().split("T")[0];

    setDateRange([today, today]); // for UI in DatePicker
    setDateFilter(`${formatted} - ${formatted}`); // for backend filter
    fetchData(1, searchTerm);
  };

  const handleDateClear = () => {
    setDateRange([null, null]); // clear datepicker UI
    setDateFilter("");
    fetchData(1, searchTerm);
  };

  const handlDownloadCSV = () => {
    if (checked.length === 0) {
      alert("Please select at least one candidate before downloading!");
      return;
    }

    const selectedCandidates = data.filter((c) => checked.includes(c.id));

    // map only the fields you want in Excel
    const dataToExport = selectedCandidates.map((c) => ({
      CandidateID: c.id,
      Candidate_name: c.candidate_name,
      Candidate_email: c.candidate_email,
      Candidate_phone: c.candidate_phone,
      Interview_status: c.interview_status,
      Interview_time: c.interview_time,
    }));

    // convert JSON to sheet
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");

    // export as file
    XLSX.writeFile(workbook, "Selected_Candidates.xlsx");
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
                  <button onClick={handlDownloadCSV}>DOwnload CSV</button>
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

                  {/* date range */}
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
                    monthsShown={2}
                    dateFormat="yyyy-MM-dd"
                    className="form-control"
                    placeholderText="YYYY-MM-DD - YYYY-MM-DD"
                  />

                  <div className="mt-2">
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={handleTodayFilter}
                    >
                      Today
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={handleDateClear}
                    >
                      Clear Date Filter
                    </button>
                  </div>
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
                      <th>
                        <input
                          type="checkbox"
                          id="ckbCheckAll"
                          checked={
                            data.length > 0 && checked.length === data.length
                          }
                          onChange={handleCheckAll}
                        />
                      </th>
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
                          <td>
                            <input
                              type="checkbox"
                              className="checkBoxClass"
                              checked={checked.includes(result.id)}
                              // checked="true"
                              onChange={() => handleCheckboxChange(result.id)}
                            />
                          </td>
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
