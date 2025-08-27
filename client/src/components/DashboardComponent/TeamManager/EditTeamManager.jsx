import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../../utils/api";

const EditTeamManager = () => {
  const { managerId } = useParams();

  const [formData, setFormData] = useState({
    team_name: "",
    manager_name: "",
  });

  const [managers, setManagers] = useState([]);

  const fetchEditTeam = async () => {
    const res = await api.get(`/employee-team/${managerId}`);
    const { team, managers } = res.data;
    setFormData({
      team_name: team?.team_name || "",
      manager_name: team?.manager_name || "", // id aa rahi hogi
    });

    setManagers(managers || []);
  };
  useEffect(() => {
    fetchEditTeam();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('the formdata is >>',formData)
    try {
      await api.put(`/employee-team/${managerId}`, formData);
      alert("Team updated successfully!");
    } catch (err) {
      console.error("Error updating team:", err);
    }
    console.log("submitted");
  };
  //   console.log("manager data is >>", managerData);
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
                        {managers.map((cat) => (
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

export default EditTeamManager;
