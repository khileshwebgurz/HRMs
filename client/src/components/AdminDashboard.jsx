import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState();
  const [stats, setStats] = useState({
    total_candidates: 0,
    total_active_candidates: 0,
    total_questions: 0,
    total_users: 0,
    user_name: '',
    app_name: 'Laravel',
  });


   const adminDataLog = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/dashboard`,
        { withCredentials: true }
      );
      setAdminData(response.data.data);
    } catch (error) {
      console.error("Error fetching leave logs:", error);
    }
  };

  useEffect(() => {
    adminDataLog();
    }, []);

  return (
    <div className="content-header">
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-6">
            <h1 className="m-0">
              Welcome {stats.user_name} to {stats.app_name}
            </h1>
          </div>
        </div>
      </div>

      <section className="content dashboard-sec">
        <div className="container-fluid">
          <div className="row">
            {[
              {
                count: stats.total_candidates,
                label: 'Total Candidates',
                link: '/trackercandidates',
                icon: 'candidate',
              },
              {
                count: stats.total_active_candidates,
                label: 'Active Candidates',
                link: '/allcandidates',
                icon: 'active',
              },
              {
                count: stats.total_questions,
                label: 'Total Questions',
                link: '/allQuestions',
                icon: 'conversation',
              },
              {
                count: stats.total_users,
                label: 'Active Employees',
                link: '/allemployees',
                icon: 'people',
              },
            ].map((box, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-md-3">
                <div className="info-box dashboard-card">
                  <div className="dashboard-card-overlay">
                    <figure className="info-box-icon bg-info elevation-1">
                      <img
                        src={`https://hrm.webguruz.in/public/dist/img/2021/icons/${box.icon}.png`}
                        alt=""
                      />
                      <img
                        src={`https://hrm.webguruz.in/public/dist/img/2021/icons/${box.icon}-overlay.png`}
                        alt=""
                      />
                    </figure>
                    <a href={box.link}>
                      <div className="info-box-content">
                        <span className="info-box-number">{box.count}</span>
                        <span className="info-box-text">{box.label}</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
