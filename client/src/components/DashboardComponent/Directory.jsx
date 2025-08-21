import '../../../public/plugins/datatables-responsive/css/responsive.bootstrap4.min.css'
import '../../../public/plugins/datatables-buttons/css/buttons.bootstrap4.min.css'
import '../../assets/css/directory.css'
import '../../../public/css/fixedColumns.dataTables.min.css'
import '../../../public/css/sweetalert2.min.css'
// import businessmen from '../../../public/dist/img/buisnessmen.png'
import { useEffect, useState } from 'react'
import axios from 'axios'

const Directory = () => {
  const [employee, setEmployee] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage, setRecordsPerPage] = useState(10)
  const [totalRecords, setTotalRecords] = useState(0)

  // Sorting states
  const [sortField, setSortField] = useState("id")
  const [sortOrder, setSortOrder] = useState("asc") // 'asc' or 'desc'

  useEffect(() => {
    fetchData()
  }, [currentPage, recordsPerPage, sortField, sortOrder, searchTerm])

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/employees`, {
        params: {
          page: currentPage,
          per_page: recordsPerPage,
          sort_field: sortField,
          sort_order: sortOrder,
          search: searchTerm
        },
        withCredentials: true
      })

      setEmployee(response.data.data) // paginated data
      setTotalRecords(response.data.total) // total records for pagination
    } catch (error) {
      console.error("Error fetching employee data:", error)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleRecordsPerPage = (e) => {
    setRecordsPerPage(parseInt(e.target.value))
    setCurrentPage(1)
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const totalPages = Math.ceil(totalRecords / recordsPerPage)

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

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span>↕</span>
    return sortOrder === "asc" ? <span>▲</span> : <span>▼</span>
  }

  return (
    <section className="content mt-4">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-primary directory-card cstm-table-outer">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="card-title">Directory</h3>
                <h5 style={{ fontSize: "17px" }}>
                  <figure>
                      {/* <img src={businessmen} alt="Businessmen" className="directory-icon" /> */}
                  </figure>
                  No. of Employees: {totalRecords}
                </h5>
              </div>
              <div className="card-body">

                {/* Filters */}
                <div className="row justify-content-between mb-3">
                  <div className='col-sm-12 col-md-6'>
                  <div className='records-per-page'>
                    Show{" "}
                    <select value={recordsPerPage} onChange={handleRecordsPerPage} class="custom-select custom-select-sm form-control form-control-sm">
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>{" "}
                    entries
                  </div>
                </div>

                <div className='col-sm-12 col-md-6'>
                  <div className="search-bar">
                    Search:{" "}
                    <input
                    class="form-control form-control-sm"
                      type="text"
                      value={searchTerm}
                      onChange={handleSearch}
                      placeholder="Search employees..."
                    />
                  </div>
                </div>
                </div>

                {/* Table */}
                <div className="table-responsive">
                  <table className="table table-striped wg_allinterviews">
                    <thead>
                      <tr>
                        <th className='sorting'>#</th>
                        <th onClick={() => handleSort('id')} className='sorting'>Employee Id <SortIcon field="id" /></th>
                        <th onClick={() => handleSort('name')} className='sorting'>Name <SortIcon field="name" /></th>
                        <th onClick={() => handleSort('email')} className='sorting'>Email <SortIcon field="email" /></th>
                        <th className='sorting'>Designation <SortIcon field="designation" /></th>
                        <th className='sorting'>Department <SortIcon field="department" /></th>
                        <th onClick={() => handleSort('manager_id')} className='sorting'>Manager <SortIcon field="manager_id" /></th>
                        {/* <th onClick={() => handleSort('location')}>Location <SortIcon field="location" /></th> */}
                        <th className='sorting'>Location <SortIcon field="location" /></th>
                      </tr>
                    </thead>
                    <tbody>
                      {employee.length > 0 ? (
                        employee.map((emp, index) => (
                          <tr key={emp.id}>
                            <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
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
                  <div className="pagination mt-3 d-flex justify-content-between align-items-center gx-3">
                    <div className='page-showing'>
                      Showing {((currentPage - 1) * recordsPerPage) + 1} to {Math.min(currentPage * recordsPerPage, totalRecords)} of {totalRecords} entries
                    </div>
                    <nav>
                      <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>
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
                              <button className="page-link" onClick={() => setCurrentPage(page)}>
                                {page}
                              </button>
                            )}
                          </li>
                        ))}

                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}>
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
  )
}

export default Directory
