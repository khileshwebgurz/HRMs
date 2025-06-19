// import React from "react";

// const LeaveLogs = ({ myLeaves }) => {

//   return (
//     <>
//       <div
//         className="tab-pane fade active show"
//         id="profile"
//         role="tabpanel"
//         aria-labelledby="profile-tab"
//       >
//         <div className="table-responsive mt-1">
//           <table
//             id="example1"
//             className="table table-striped wg_allleavelogs"
//             style={{ width: "100%" }}
//           >
//             <thead>
//               <tr>
//                 <th>Leave Type</th>
//                 <th>Start Date</th>
//                 <th>End Date</th>
//                 <th>Total Days</th>
//                 <th>Applied On</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {myLeaves && myLeaves.length > 0 ? (
//                 myLeaves.map((leave, index) => (
//                   <tr key={leave.id || index}>
//                     <td>{leave.type_name}</td>
//                     <td>—</td> 
//                     <td>—</td>
//                     <td>—</td>
//                     <td>{new Date(leave.created_at).toLocaleDateString()}</td>
//                     <td>—</td>
//                     <td>
//                       <button className="btn btn-sm btn-primary">View</button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="text-center">
//                     No leave logs available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* <div
//           className="tab-pane fade active show "
//           id="contact"
//           role="tabpanel"
//           aria-labelledby="contact-tab"
//         >
//           <br />
//           <h4>Rule List</h4>
//           <hr />

//           <div className="row">
//             <div className="col-md-3 wrapper shadow bg-white rounded rules">
//               <label>Loss of pay</label>
//               <br /> <strong>Effective Date: </strong>
//               <span>30-08-2020</span>
//             </div>

//             <div className="col-md-8 shadow bg-white rounded">
//               <div className="container my-4">
//                 <div className="row">
//                   <div className="col-xl-12 mb-4 mb-xl-0">
//                     <section>
//                       <ul className="nav nav-tabs" id="myTab" role="tablist">
//                         <li className="nav-item waves-effect waves-light">
//                           <a
//                             className="nav-link active"
//                             id="general-tab"
//                             data-toggle="tab"
//                             href="#general"
//                             role="tab"
//                             aria-controls="general"
//                             aria-selected="false"
//                           >
//                             General Settings
//                           </a>
//                         </li>
//                         <li className="nav-item waves-effect waves-light">
//                           <a
//                             className="nav-link "
//                             id="advance-tab"
//                             data-toggle="tab"
//                             href="#advance"
//                             role="tab"
//                             aria-controls="advance"
//                             aria-selected="false"
//                           >
//                             Advance Settings
//                           </a>
//                         </li>
//                       </ul>
//                       <div className="tab-content" id="myTabContent">
//                         <div
//                           className="tab-pane fade active show"
//                           id="general"
//                           role="tabpanel"
//                           aria-labelledby="general-tab"
//                         >
//                           <h5>
//                             <b>Name</b>
//                           </h5>
//                           <p>Loss of pay</p>
//                           <h5>
//                             <b>Description</b>
//                           </h5>
//                           <p>
//                             This is default system provided option for all users
//                             in case of low leave balance.
//                           </p>
//                           <hr />
//                           <div className="row">
//                             <div className="col-md-3">
//                               <b>Leaves count</b>
//                             </div>
//                             <div className="col-md-4">
//                               <ul>
//                                 <li>
//                                   <b>Weekends between leave</b>
//                                 </li>
//                                 <li>
//                                   <p>Not Considered</p>
//                                 </li>
//                               </ul>
//                             </div>
//                             <div className="col-md-4">
//                               <ul>
//                                 <li>
//                                   <b>Holidays between leave</b>
//                                 </li>
//                                 <li>
//                                   <p>Not Considered</p>
//                                 </li>
//                               </ul>
//                             </div>
//                           </div>
//                           <hr />
//                           <div className="row">
//                             <div className="col-md-3">
//                               <b>Applicability</b>
//                             </div>
//                             <div className="col-md-8">
//                               <ul>
//                                 <li>
//                                   <b>Allowed Under Probation</b>
//                                 </li>
//                                 <li>
//                                   <p>Yes</p>
//                                 </li>
//                               </ul>
//                             </div>
//                           </div>
//                           <hr />
//                           <div className="row" style={{ height: "54px" }}></div>
//                         </div>

//                         <div
//                           className="tab-pane fade "
//                           id="advance"
//                           role="tabpanel"
//                           aria-labelledby="advance-tab"
//                         >
//                           <div className="row">
//                             <div className="col-md-4">
//                               <b>Miscellaneous</b>
//                             </div>
//                             <div className="col-md-4">
//                               <ul>
//                                 <li>
//                                   <b>Backdated Leaves Allowed</b>
//                                 </li>
//                                 <li>
//                                   <p>Yes</p>
//                                 </li>
//                               </ul>
//                               <ul>
//                                 <li>
//                                   <b>Apply Leaves for Next Year Till</b>
//                                 </li>
//                                 <li>
//                                   <p>December</p>
//                                 </li>
//                               </ul>
//                             </div>
//                             <div className="col-md-4">
//                               <ul>
//                                 <li>
//                                   <b>Backdated Leaves Allowed up to</b>
//                                 </li>
//                                 <li>
//                                   <p>30 Days</p>
//                                 </li>
//                               </ul>
//                             </div>
//                           </div>
//                           <hr />
//                           <div className="row" style={{ height: "70px" }}></div>
//                         </div>
//                       </div>
//                     </section>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div
//           className="tab-pane fade active show"
//           id="teamleaves"
//           role="tabpanel"
//           aria-labelledby="teamleaves-tab"
//         >
//           <br />
//           <div className="row input-daterange">
//             <div className="col-sm-8">
//               <div className="row">
//                 <div className="col-sm-5 mb-3">
//                   <fieldset className="form-group">
//                     <div
//                       className="input-group date"
//                       id="from_date"
//                       data-target-input="nearest"
//                     >
//                       <input
//                         type="text"
//                         className="form-control datetimepicker-input"
//                         placeholder="From Date"
//                         name="from_date"
//                         id="from"
//                         data-target="#from_date"
//                       />
//                       <div
//                         className="input-group-append"
//                         data-target="#from_date"
//                         data-toggle="datetimepicker"
//                       >
//                         <div className="input-group-text">
//                           <i className="fa fa-calendar"></i>
//                         </div>
//                       </div>
//                     </div>
//                   </fieldset>
//                 </div>
//                 <div className="col-sm-5 mb-3">
//                   <fieldset className="form-group">
//                     <div
//                       className="input-group date"
//                       id="to_date"
//                       data-target-input="nearest"
//                     >
//                       <input
//                         type="text"
//                         className="form-control datetimepicker-input"
//                         placeholder="To Date"
//                         name="to_date"
//                         id="to"
//                         data-target="#to_date"
//                       />
//                       <div
//                         className="input-group-append"
//                         data-target="#to_date"
//                         data-toggle="datetimepicker"
//                       >
//                         <div className="input-group-text">
//                           <i className="fa fa-calendar"></i>
//                         </div>
//                       </div>
//                     </div>
//                   </fieldset>
//                 </div>
//                 <div className="col-sm-2 mb-3">
//                   <button
//                     type="button"
//                     name="filter"
//                     id="filter"
//                     className="btn btn-primary btn-sm cstm-bg-primary"
//                   >
//                     Filter
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="col-sm-4">
//               <button
//                 name="wgz_bulk_approve"
//                 className="btn btn-warning btn-sm site-main-btn  leave-btn"
//                 id="wgz_bulk_approve"
//               >
//                 Bulk Approve
//               </button>
//             </div>
//           </div>
//           <br />

//           <div className="table-responsive">
//             <table
//               className="table table-sm mt-4 leave-request-table"
//               id="teamleaveRequestTable"
//             >
//               <thead>
//                 <tr>
//                   <th>
//                     <input type="checkbox" id="ckbCheckAll" />
//                   </th>
//                   <th style={{ textAlign: "center" }}>Employee Name</th>
//                   <th style={{ textAlign: "center" }}>Type</th>
//                   <th style={{ textAlign: "center" }}>Reason</th>
//                   <th style={{ textAlign: "center" }}>Start Date</th>
//                   <th style={{ textAlign: "center" }}>End Date</th>
//                   <th style={{ textAlign: "center" }}>Applied On</th>
//                   <th style={{ textAlign: "center" }}>Status</th>
//                   <th style={{ textAlign: "center" }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody></tbody>
//             </table>
//           </div>
//         </div> */}
//     </>
//   );
// };

// export default LeaveLogs;

import React from "react";

const LeaveLogs = ({ myLeaves }) => {
  if (!myLeaves || myLeaves.length === 0) {
    return <p className="mt-3">No leave logs found.</p>;
  }

  const handleView = (log) => {
    console.log("Viewing leave:", log);
    // Show modal or navigate to view page
  };

  const handleEdit = (log) => {
    console.log("Editing leave:", log);
    // Trigger edit functionality
  };

  const handleDelete = (logId) => {
    console.log("Deleting leave ID:", logId);
    // Call API or confirm dialog
  };

  return (
    <div className="table-responsive mt-3">
      <table className="table table-bordered table-striped">
        <thead className="thead-dark">
          <tr>
            <th>Leave Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Total Applied</th>
            <th>Status</th>
            <th>Applied On</th>
            <th>Action</th> {/* 🔸 New column */}
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
                <td dangerouslySetInnerHTML={{ __html: log.action }} />
              </tr>
            ))}
          </tbody>

      </table>
    </div>
  );
};

export default LeaveLogs;
