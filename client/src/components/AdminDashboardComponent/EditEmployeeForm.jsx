import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditEmployeeForm = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);


  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    password_confirmation: "",
    role_id: "",
    attendance_rule_id: "",
    leave_rule_id: [],
    room_id: "",
    crm: "0",
    Interviewer: "0",
    manager_id: "",
    team_id: "",
    is_manager: "0",
  });

  const [rooms, setRooms] = useState([]);
  const [teams, setTeams] = useState([]);

  const attendanceRule = {
    1: "employee",
    2: "Team Leader",
    3: "manager",
    4: "testing",
    5: "Sumit",
    6: "Employee Researcher PS",
  };

  const leaveRule = {
    1: "Casual Leave",
    2: "Emergency Leave",
    3: "Sick leave",
    4: "Comp off",
    5: "Short leave",
    6: "test",
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/edit-employee/${userId}`,
        {
          withCredentials: true,
        }
      );

      const data = res.data.data;
      const employee = data.user;
      const is_interviewer = data.obcandidates;
      const attendance_rule = data.attendance_rule; //attendance rule seems coming from here but as a rule_name

     

      setForm({
        name: employee?.name || "",
        email: employee?.email || "",
        phone: employee?.phone || "",
        gender: employee?.gender || "",
        password: "",
        password_confirmation: "",
        role_id: employee?.role_id || "",
        attendance_rule_id: data.rules?.id?.toString() || "",
        leave_rule_id: data.employeeleave?.map((id) => id.toString()) || [],
        room_id: data?.user?.room_id?.toString() || "",
        crm: employee?.crm === 1 ? "1" : "0",
        Interviewer: is_interviewer?.is_interviewer === 1 ? "1" : "0",
        manager_id: employee?.manager_id?.toString() || "",
        team_id: employee?.team_id?.toString() || "",
        is_manager: employee?.is_manager === 1 ? "1" : "0",
      });


      setRooms(data.rooms || []);
      setTeams(data.team_name || []);
      setRoles(data.roles || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // console.log('my attendance rules are >>>>', attendanceRules)

  const handleLeaveRuleChange = (e) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setForm({ ...form, leave_rule_id: selected });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/edit-employee-post`,
        {
          user_id: userId,
          ...form,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data.status === 200) {
        alert("Employee updated successfully!");
      } else {
        alert(res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      alert("An error occurred while submitting the form");
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="container mt-4">
      <h3>Edit Employee</h3>
      <div className="row">
        <div className="col-md-6">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-6">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-6">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label>Confirm Password</label>
          <input
            type="password"
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={(e) =>
              setForm({ ...form, password_confirmation: e.target.value })
            }
            className="form-control"
          />
        </div>

        {/* <div className="col-md-6">
          <div className="col-md-6">
            <label>Role</label>
            <select
              value={form.role_id}
              onChange={(e) => setForm({ ...form, role_id: e.target.value })}
            >
              <option value="1">Admin(HR)</option>
              <option value="2">Recruiter</option>
            </select>
          </div>
        </div> */}
        <div className="col-md-6">
          <label>Role</label>
          <select
            value={form.role_id}
            onChange={(e) => setForm({ ...form, role_id: e.target.value })}
            className="form-control"
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.role_name}
              </option>
            ))}
          </select>
        </div>


        <div className="col-md-6">
          <label>Gender</label>
          <select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="">Select Gender</option>
            <option value="1">Male</option>
            <option value="2">Female</option>
          </select>
        </div>
        <div className="col-md-6">
          <label>Attendance Rule</label>
          <select
            name="attendance_rule_id"
            value={form.attendance_rule_id}
            onChange={(e) =>
              setForm({ ...form, attendance_rule_id: e.target.value })
            }
            className="form-control"
          >
            <option value="">Select Attendance Rule</option>
            {Object.entries(attendanceRule).map(([id, ruleName]) => (
              <option key={`rule-${id}`} value={id}>
                {ruleName}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label>Leave Rules</label>
          <select
            multiple
            name="leave_rule_id"
            value={form.leave_rule_id}
            onChange={handleLeaveRuleChange}
            className="form-control"
          >
            <option value="">Select Leave Rule</option>
            {Object.entries(leaveRule).map(([id, ruleName]) => (
              <option key={`rule-${id}`} value={id}>
                {ruleName}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label>Room</label>
          <select
            name="room_id"
            value={form.room_id}
            onChange={(e) => setForm({ ...form, room_id: e.target.value })}
            className="form-control"
          >
            <option value="">Select Room</option>
            {rooms.map((room) => (
              <option key={`room-${room.id}`} value={room.id}>
                {room.room_name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label>CRM</label>
          <div>
            <label>
              <input
                type="radio"
                name="crm"
                value="1"
                checked={form.crm === "1"}
                onChange={(e) => setForm({ ...form, crm: e.target.value })}
              />{" "}
              Enable
            </label>
            <label>
              <input
                type="radio"
                name="crm"
                value="0"
                checked={form.crm === "0"}
                onChange={(e) => setForm({ ...form, crm: e.target.value })}
              />{" "}
              Disable
            </label>
          </div>
        </div>
        <div className="col-md-6">
          <label>Manager ID</label>
          <input
            type="text"
            name="manager_id"
            value={form.manager_id}
            onChange={(e) => setForm({ ...form, manager_id: e.target.value })}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label>Team</label>
          <select
            name="team_id"
            value={form.team_id}
            onChange={(e) => setForm({ ...form, team_id: e.target.value })}
            className="form-control"
          >
            <option value="">Select Team</option>
            {teams.map((team, index) => (
              <option key={`team-${index}`} value={team.id}>
                {team.team_name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label>Is Manager?</label>
          <div>
            <label>
              <input
                type="radio"
                name="is_manager"
                value="1"
                checked={form.is_manager === "1"}
                onChange={(e) =>
                  setForm({ ...form, is_manager: e.target.value })
                }
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="is_manager"
                value="0"
                checked={form.is_manager === "0"}
                onChange={(e) =>
                  setForm({ ...form, is_manager: e.target.value })
                }
              />{" "}
              No
            </label>
          </div>
        </div>
        <div className="col-md-6">
          <label>Interviewer?</label>
          <div>
            <label>
              <input
                type="radio"
                name="Interviewer"
                value="1"
                checked={form.Interviewer === "1"}
                onChange={(e) =>
                  setForm({ ...form, Interviewer: e.target.value })
                }
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="Interviewer"
                value="0"
                checked={form.Interviewer === "0"}
                onChange={(e) =>
                  setForm({ ...form, Interviewer: e.target.value })
                }
              />{" "}
              No
            </label>
          </div>
        </div>
        <div className="col-12 mt-3">
          <button type="submit" className="btn btn-primary">
            Update Employee
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditEmployeeForm;
