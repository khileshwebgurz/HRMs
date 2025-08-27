import { useState, useEffect } from "react";
import api from "../../../../utils/api";

const AddEmployeeTeam = () => {
  const [allManager, setAllManager] = useState([]);
  const [formData, setFormData] = useState({
    team_name: "",
    manager_name: "",
  });
  const fetchManagers = async () => {
    const res = await api.get("/employee-team-add");
    setAllManager(res.data);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    fetchManagers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    api.post("/employee-team", formData);
    alert("Team successfully added.");
  };


  return (
    <>
      <section className="content mt-4 ">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-primary employeeTeam-show">
                <div className="card-header">
                  <h3 className="card-title">Employee Team</h3>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label for="team_name">Team Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="team_name"
                        name="team_name"
                        value={formData.team_name}
                        onChange={handleChange}
                        placeholder="Enter Team Name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label for="manager_name">Select Manager</label>
                      <select
                        className="form-control"
                        name="manager_name"
                        id="manager_name"
                        value={formData.manager_name}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select</option>
                        {allManager?.data?.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" className="btn btn-info">
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddEmployeeTeam;
