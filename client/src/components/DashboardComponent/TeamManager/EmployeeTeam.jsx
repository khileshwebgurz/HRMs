import { useState, useEffect } from "react";
import api from "../../../../utils/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const EmployeeTeam = () => {
  const [manager, setManager] = useState([]);
  const navigate = useNavigate();
  const fetchManagers = async () => {
    const res = await api.get("/employee-team");
    setManager(res.data.data);
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleEditManagerTeam = (managerId) => {
    navigate(`/employee/employee-team-edit/${managerId}`);
  };

  const handleDeleteManagerTeam = async (managerId) => {
    await api.delete(`/employee-team/${managerId}`);
    fetchManagers();
  };

  console.log(manager)
  return (
    <>
      <section className="content mt-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-primary employeeTeam-show">
                <div className="card-header salary-slip-header d-flex align-items-center justify-content-between">
                  <h3 className="card-title">Assign Team Manager</h3>
                  <Link
                    to="/employee/employee-team-add"
                    className="btn btn-primary site-main-btn-2 font-weight-500 btn-reverse hide-show"
                  >
                    <i className="fa fa-plus"></i> Add
                  </Link>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped wg_salaryslip border-collapse">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Team Name</th>
                          <th>Manager Name</th>
                          <th>Created By</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {manager.length > 0 ? (
                          manager.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.team_name}</td>
                              <td>{item.manager_name}</td>
                              <td>{item.created_by_name}</td>
                              <td>
                                <button
                                  onClick={() => handleEditManagerTeam(item.id)}
                                  className="btn btn-sm btn-primary"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteManagerTeam(item.id)
                                  }
                                  className="btn btn-sm btn-danger ms-2"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">
                              No data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default EmployeeTeam;
