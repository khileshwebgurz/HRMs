import React from "react";

const LeaveLogs = ({
  myLeaves,
  onDelete,
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  if (!myLeaves || myLeaves.length === 0) {
    return <p>No leave logs found.</p>;
  }

  return (
    <div className="table-responsive cstm-table-outer mt-3">
      {/* <input
        type="text"
        placeholder="Search by leave type..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // reset to page 1 when searching
        }}
        className="form-control my-3"
      /> */}
      <table className="table table-bordered table-striped leave-logs-table">
        <thead>
          <tr>
            <th className="sorting">Leave Type </th>
            <th className="sorting">Start Date </th>
            <th className="sorting">End Date </th>
            <th className="sorting">Total Applied </th>
            <th className="sorting">Status </th>
            <th className="sorting">Applied On </th>
            <th className="sorting">Action </th>
          </tr>
        </thead>
        <tbody>
          {myLeaves.map((log, index) => (
            <tr key={index}>
              <td>{log.leave_type}</td>
              <td>{log.start_date}</td>
              <td>{log.end_date}</td>
              <td>{log.total_applied_leaves}</td>
              <td>{log.status}</td>
              <td>{log.created_at}</td>
              <td>
                {log.status === "Pending" ? (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(log.id)}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="pagination">
        <button
          className="btn btn-secondary page-link"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="btn btn-secondary page-link"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveLogs;
