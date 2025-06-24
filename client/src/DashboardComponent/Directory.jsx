import '../assets/css/directory.css'
import '/public/plugins/datatables-responsive/css/responsive.bootstrap4.min.css'
import '/public/plugins/datatables-buttons/css/buttons.bootstrap4.min.css'
import '/public/css/fixedColumns.dataTables.min.css'
import '/public/css/sweetalert2.min.css'
import  { useEffect, useState } from 'react'
import axios from 'axios'

const Directory = () => {
  const [employee, setEmployee] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage, setRecordsPerPage] = useState(10)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/employees`, { withCredentials: true })
        setEmployee(response.data)
      } catch (error) {
        console.error("Error fetching employee data:", error)
      }
    }
    fetchData()
  }, [])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to first page on new search
  }

  const handleRecordsPerPage = (e) => {
    setRecordsPerPage(parseInt(e.target.value))
    setCurrentPage(1)
  }

  // Filter based on search
  const filteredEmployees = employee.filter((emp) =>
    Object.values(emp).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const totalPages = Math.ceil(filteredEmployees.length / recordsPerPage)
  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage
  const currentEmployees = filteredEmployees.slice(indexOfFirstRecord, indexOfLastRecord)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const generatePageNumbers = () => {
    const pages = []
    const maxVisible = 5

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    return pages
  }

  return (
    <>
      <section className="content mt-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-primary directory-card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h3 className="card-title">Directory</h3>
                  <h5 style={{ fontSize: "17px" }}>
                    No. of Employees: {employee.length}
                  </h5>
                </div>
                <div className="card-body">

                  {/* Filters */}
                  <div className="d-flex justify-content-between mb-3">
                    <div>
                      Show{" "}
                      <select value={recordsPerPage} onChange={handleRecordsPerPage}>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>{" "}
                      entries
                    </div>

                    <div>
                      Search:{" "}
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search employees..."
                      />
                    </div>
                  </div>

                  {/* Table */}
                  <div className="table-responsive_">
                    <table className="table table-striped wg_allinterviews table-responsive">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Employee Id</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Designation</th>
                          <th>Department</th>
                          <th>Manager</th>
                          <th>Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentEmployees.length > 0 ? (
                          currentEmployees.map((emp, index) => (
                            <tr key={emp.id}>
                              <td>{indexOfFirstRecord + index + 1}</td>
                              <td>{emp.id}</td>
                              <td>{emp.name}</td>
                              <td>{emp.email}</td>
                              <td>{emp.designation || 'N/A'}</td>
                              <td>{emp.department || 'N/A'}</td>
                              <td>{emp.manager_id || 'N/A'}</td>
                              <td>{emp.location || 'N/A'}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" style={{ textAlign: 'center' }}>
                              No results found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination mt-3 d-flex justify-content-center">
                      <nav>
                        <ul className="pagination">
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => currentPage > 1 && paginate(currentPage - 1)}>
                              Previous
                            </button>
                          </li>

                          {generatePageNumbers().map((page, index) => (
                            <li
                              key={index}
                              className={`page-item ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}
                            >
                              {page === '...' ? (
                                <span className="page-link">...</span>
                              ) : (
                                <button className="page-link" onClick={() => paginate(page)}>
                                  {page}
                                </button>
                              )}
                            </li>
                          ))}

                          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => currentPage < totalPages && paginate(currentPage + 1)}>
                              Next
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Directory
