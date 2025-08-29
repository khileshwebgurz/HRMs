import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";
// tracker Controller
const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemPerPage] = useState(10);

  const [checked, setChecked] = useState([]);

  // date filter
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [dateFilter, setDateFilter] = useState("");

  const navigate = useNavigate();

  console.log("my checkdata is >>", checked);

  const fetchCandidates = async (
    page = currentPage,
    term = searchTerm,
    limit = itemsPerPage
  ) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/candidates`,
        {
          params: {
            page,
            limit,
            search: term,
            datefilter: dateFilter,
          },
          withCredentials: true,
        }
      );

      setCandidates(response.data.data);
      setFilteredCandidates(response.data.data);

      setTotalPages(response.data.last_page);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  // toggle single checkbox
  const handleCheckboxChange = (id) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  // for selectall checkbox
  const handleCheckAll = (e) => {
    if (e.target.checked) {
      const allIds = filteredCandidates.map((c) => c.id);
      setChecked(allIds);
    } else {
      setChecked([]);
    }
  };
  useEffect(() => {
    fetchCandidates(currentPage);
  }, [currentPage, itemsPerPage, dateFilter]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchCandidates(1, searchTerm);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleBrnClick = (url) => {
    navigate(`${url}`);
  };

  const handleEditClick = (url) => {
    navigate(`/users/${url}`);
  };

  const handleSendProdileUpdateLink = async (candidateId) => {
    const numericId = candidateId.replace("HRM", "");
    console.log(candidateId, "candidateId");
    console.log(numericId, "numericId");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/send-email/${numericId}`,
        { withCredentials: true }
      );

      console.log(response, "response");
      alert("Send Update Profile Link to Candidate successfully!");
      // fetchCandidates(currentPage);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Something went wrong while sending the email.");
    }
  };

  const handleDeleteBtn = async (id) => {
    const numericId = id.replace("HRM", "");
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/candidates/${numericId}`,
        { withCredentials: true }
      );

      const updatedCandidates = candidates.filter(
        (candidate) => candidate.id !== id
      );

      setCandidates(updatedCandidates);
      fetchCandidates(currentPage);
    } catch (error) {
      console.error("cannot delete bcz of this issue ->", error);
    }
  };

  const handleRecordsPerPage = (e) => {
    setItemPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };


  // --- Add this function ---
const handleDownload = () => {
  if (checked.length === 0) {
    alert("Please select at least one candidate before downloading!");
    return;
  }

  // get selected candidates
  const selectedCandidates = candidates.filter((c) =>
    checked.includes(c.id)
  );

  // map only the fields you want in Excel
  const dataToExport = selectedCandidates.map((c) => ({
    CandidateID: c.id,
    Name: c.full_name,
    Email: c.email,
    Phone: c.mobile_number,
    LinkedIn: c.linked_in,
    NoticePeriod: c.notice_period,
    CurrentLocation: c.current_location,
    DateApplied: c.created_at,
  }));

  // convert JSON to sheet
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");

  // export as file
  XLSX.writeFile(workbook, "Selected_Candidates.xlsx");
};

const handleDateClear = ()=>{
   setDateRange([]);
  setDateFilter("")
  fetchCandidates(1, searchTerm);
}


console.log('mu datrange is >>',dateRange)
  return (
    <div className="container mt-4">
      <h1>All Candidates</h1>
      <div>
        Show{" "}
        <select value={itemsPerPage} onChange={handleRecordsPerPage}>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>{" "}
        entries
      </div>
      <button
        className="btn btn-success btn-sm"
        onClick={handleDownload}
      >Download CSV</button>
      <div></div>
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
        // showTimeSelect
        timeIntervals={30}
        dateFormat="yyyy-MM-dd h:mm aa"
        className="form-control"
        todayButton="Today" 
        placeholderText="YYYY-MM-DD - YYYY-MM-DD"
      />

<button onClick={handleDateClear}>Clear date filter</button>
      {loading ? (
        <p>Loading candidates...</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="ckbCheckAll"
                      checked={
                        filteredCandidates.length > 0 &&
                        checked.length === filteredCandidates.length
                      }
                      onChange={handleCheckAll}
                    />
                  </th>
                  <th>#</th>
                  <th
                    // onClick={() => handleSort("full_name")}
                    style={{ cursor: "pointer" }}
                  >
                    Name{" "}
                    {/* {sortField === "full_name" &&
                      (sortOrder === "asc" ? "⬆️" : "⬇️")} */}
                  </th>
                  <th>Candidate ID</th>
                  <th>LinkedIn</th>
                  <th
                    // onClick={() => handleSort("created_at")}
                    style={{ cursor: "pointer" }}
                  >
                    Date Applied{" "}
                    {/* {sortField === "created_at" &&
                      (sortOrder === "asc" ? "⬆️" : "⬇️")} */}
                  </th>
                  <th>Email</th>
                  {/* <th>Status</th> */}
                  <th>Phone</th>
                  <th>Notice Period</th>
                  <th>Current Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((row, index) => (
                  <tr key={row.id}>
                    <td>
                      <input
                        type="checkbox"
                        className="checkBoxClass"
                        checked={checked.includes(row.id)}
                        onChange={() => handleCheckboxChange(row.id)}
                      />
                    </td>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{row.full_name}</td>
                    <td>{row.id}</td>
                    <td>
                      <a
                        href={row.linked_in}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn
                      </a>
                    </td>
                    <td>{row.created_at}</td>
                    <td>{row.email}</td>
                    {/* <td>{row.status}</td> */}
                    <td>{row.mobile_number}</td>
                    <td>{row.notice_period}</td>
                    <td>{row.current_location}</td>
                    <td>
                      <div className="btn-group">
                        <button
                          onClick={() => handleBrnClick(row.action?.view_url)}
                          style={{ color: "#707070" }}
                          className="btn btn-info site-icon eye-icon"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        {row.action.edit_allowed && (
                          <button
                            onClick={() => handleEditClick(row.action.edit_url)}
                            className="btn btn-success site-icon pencil-icon"
                            style={{ color: "#707070" }}
                          >
                            <i className="fas fa-pencil-alt"></i>
                          </button>
                        )}
                        {row.action.delete_allowed && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (window.confirm("Are you sure?")) {
                                handleDeleteBtn(row.id);
                              }
                            }}
                            className="btn btn-danger delete-icon site-icon"
                            style={{ color: "#707070" }}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}

                        <button
                          onClick={() => handleSendProdileUpdateLink(row.id)}
                          className="site-icon paper-plane-icon"
                          style={{ color: "#707070" }}
                        >
                          <i className="fas fa-paper-plane"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-between align-items-center">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div>
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
        </>
      )}
    </div>
  );
};

export default CandidateList;
