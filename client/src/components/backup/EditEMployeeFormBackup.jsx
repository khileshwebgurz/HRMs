import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditEmployeeForm = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
    password_confirmation: '',
    attendance_rule_id: '',
    leave_rule_id: [],
    room_id: '',
    crm: '0',
    Interviewer: '0',
    manager_id: '',
    team_id: '',
    is_manager: '0',
  });

  const [options, setOptions] = useState({
    roles: {},
    genders: {},
    rules: [],
    leaveRules: [],
    rooms: [],
    teams: [],
  });

  const fetchData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/edit-employee/${userId}`, {
        withCredentials: true
      });

      const {
        user, user_roles, genders, rules,
        leaverules, rooms, team_name, employeeleave, obcandidates
      } = res.data.data;

      setForm(prev => ({
        ...prev,
        ...user,
        crm: obcandidates?.is_crm?.toString() || '0',
        Interviewer: obcandidates?.is_interviewer?.toString() || '0',
        attendance_rule_id: obcandidates?.attendance_rule_id || '',
        leave_rule_id: Array.isArray(employeeleave) ? employeeleave.map(String) : [],
        password: '',
        password_confirmation: ''
      }));

      setOptions({
        roles: user_roles,
        genders,
        rules,
        leaveRules: leaverules,
        rooms,
        teams: team_name
      });
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, options: opts, multiple } = e.target;

    if (type === 'radio') {
      setForm(prev => ({ ...prev, [name]: value }));
    } else if (multiple) {
      const selectedValues = Array.from(opts).filter(opt => opt.selected).map(opt => opt.value);
      setForm(prev => ({ ...prev, [name]: selectedValues }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, val]) => {
        if (Array.isArray(val)) {
          val.forEach(v => formData.append(`${key}[]`, v));
        } else {
          formData.append(key, val);
        }
      });

      formData.append('user_id', userId);

      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/edit-employee-post`, formData, {
        withCredentials: true
      });

      alert(res.data.message);
      navigate('/all-employees');
    } catch (err) {
      alert(err?.response?.data?.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <h3>Edit Employee</h3>
      <div className="row">
        <div className="col-md-6">
          <label>Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="form-control" required />
        </div>
        <div className="col-md-6">
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" required />
        </div>
        <div className="col-md-6">
          <label>Phone</label>
          <input type="text" name="phone" value={form.phone} onChange={handleChange} className="form-control" />
        </div>
        <div className="col-md-6">
          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" />
        </div>
        <div className="col-md-6">
          <label>Confirm Password</label>
          <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} className="form-control" />
        </div>
        <div className="col-md-6">
          <label>Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} className="form-control">
            {Object.entries(options.genders).map(([key, val]) => (
              <option key={`gender-${key}`} value={key}>{val}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label>Attendance Rule</label>
          <select name="attendance_rule_id" value={form.attendance_rule_id} onChange={handleChange} className="form-control">
            {options.rules.map(rule => (
              <option key={`rule-${rule.id}`} value={rule.id}>{rule.rule_name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label>Leave Rules</label>
          <select multiple name="leave_rule_id" value={form.leave_rule_id} onChange={handleChange} className="form-control">
            {options.leaveRules.map(rule => (
              <option key={`leave-${rule.id}`} value={rule.id}>{rule.rule_name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label>Room</label>
          <select name="room_id" value={form.room_id} onChange={handleChange} className="form-control">
            <option value="">Select Room</option>
            {options.rooms.map(room => (
              <option key={`room-${room.id}`} value={room.id}>{room.room_name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label>CRM</label>
          <div>
            <label><input type="radio" name="crm" value="1" checked={form.crm === '1'} onChange={handleChange} /> Enable</label>
            <label><input type="radio" name="crm" value="0" checked={form.crm === '0'} onChange={handleChange} /> Disable</label>
          </div>
        </div>
        <div className="col-md-6">
          <label>Manager ID</label>
          <input type="text" name="manager_id" value={form.manager_id} onChange={handleChange} className="form-control" />
        </div>
        <div className="col-md-6">
          <label>Team</label>
          <select name="team_id" value={form.team_id} onChange={handleChange} className="form-control">
            <option value="">Select Team</option>
            {options.teams.map(team => (
              <option key={`team-${team.id}`} value={team.id}>{team.team_name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label>Is Manager?</label>
          <div>
            <label><input type="radio" name="is_manager" value="1" checked={form.is_manager === '1'} onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="is_manager" value="0" checked={form.is_manager === '0'} onChange={handleChange} /> No</label>
          </div>
        </div>
        <div className="col-md-6">
          <label>Interviewer?</label>
          <div>
            <label><input type="radio" name="Interviewer" value="1" checked={form.Interviewer === '1'} onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="Interviewer" value="0" checked={form.Interviewer === '0'} onChange={handleChange} /> No</label>
          </div>
        </div>
        <div className="col-12 mt-3">
          <button type="submit" className="btn btn-primary">Update Employee</button>
        </div>
      </div>
    </form>
  );
};

export default EditEmployeeForm;
