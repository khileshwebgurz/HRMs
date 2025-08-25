import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { admindashboard } from "../../../hooks/admindashboard";
const AdminDashboard = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await admindashboard(); 
        setStats(data);
      } catch (error) {
        console.error("Error fetching admin dashboard:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="content-header">
      <div className="container">
        <div className="row mb-2">
          <div className="col-sm-6">
            <h1 className="m-0">
              Welcome {stats?.logged_in?.name} to HRM Portal
              {/* Hello world */}
            </h1>
          </div>
        </div>
      </div>

      <section className="content dashboard-sec">
        <div className="container">
          <div className="row">
            {[
              {
                count: stats.total_candidates,
                label: "Total Candidates",
                link: "/tracker/candidates",
                icon: "candidate",
              },
              {
                count: stats.total_active_candidates,
                label: "Active Candidates",
                link: "/users/candidate/all-candidates",
                icon: "active",
              },
              {
                count: stats.total_questions,
                label: "Total Questions",
                link: "/all-questions",
                icon: "conversation",
              },
              {
                count: stats.total_users,
                label: "Active Employees",
                link: "/all-employees",
                icon: "people",
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
                    <Link to={box.link}>
                      <div className="info-box-content">
                        <span className="info-box-number">{box.count}</span>
                        <span className="info-box-text">{box.label}</span>
                      </div>
                    </Link>
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
