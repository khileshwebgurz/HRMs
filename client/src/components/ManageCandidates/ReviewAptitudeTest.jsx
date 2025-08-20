import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const ReviewAptitudeTest = () => {
  const user = useUser();
  const navigate = useNavigate();
  const [testData, setTestData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemPerPage] = useState(10);

  const fetchTest = async (
    page = 1,
    term = searchTerm,
    limit = itemsPerPage
  ) => {
    const res = await axios.get(
      `http://localhost:8000/api/all-candidate-test?page=${page}&limit=${limit}&search=${encodeURIComponent(
        term
      )}`,
      { withCredentials: true }
    );
    setTestData(res.data.data);
    setTotalPages(res.data.last_page);
  };
  useEffect(() => {
    fetchTest(currentPage);
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchTest(1, searchTerm);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const status = {
    1: "Active",
    2: "Link Expired",
    3: "Completed",
  };

  const handleRecordsPerPage = (e) => {
    setItemPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  console.log("khgsdsd", testData);
  return (
    <>
      {user.user_role !== "1" ? (
        <>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>All Candidates</h1>
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
                  <h1>All Candidates</h1>
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
                <div className="col-sm-6 text-right"></div>
              </div>
            </div>
          </section>
          <div className="card test-table">
            <div className="card-body">
              <div className="table-responsive">
                <table
                  id="example1"
                  className="table table-bordered table-striped wg_allusers"
                >
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Candidate Name</th>
                      <th>Token</th>
                      <th>Link</th>
                      <th>OTP</th>
                      <th>Result</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testData?.length > 0 ? (
                      testData.map((result, index) => (
                        <tr key={result.id}>
                          <td>{index + 1}</td>
                          <td>{result?.candidate?.full_name}</td>
                          <td>{result?.token}</td>
                          <td>
                            {`https://hrm.webguruz.in/public/test/${result?.token}`}
                          </td>
                          <td>{result?.otp}</td>
                          <td>{result?.status}</td>
                          <td>{status[result?.status] ?? "Unknown"}</td>
                          <td>
                            {status[result?.status] === "Completed" && (
                              <i onClick={()=>navigate(`/public/users/candidate-test/${result.id}`)} className="fas fa-eye"></i>
                            )}
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

export default ReviewAptitudeTest;
