import React, { useEffect } from "react";
import "../assets/css/leaves.css";
import ApplyLeave from "./LeavesComponent/ApplyLeave";
import LeaveLogs from "./LeavesComponent/LeaveLogs";
import { useState } from "react";
import axios from "axios";
const Leaves = () => {
  const [ leavedata, setLeaveData] = useState([]);
  useEffect(()=>{
    const MyLeaveData = async()=>{
      const data = await axios.get('http://localhost:8000/api/employee/leaves',{withCredentials:true});
      setLeaveData(data.data);
    }
    MyLeaveData();
  },[])
  const [activeTab, setActiveTab] = useState("applyleave");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  
  return (
    <>
      <div className="container leave-page">
        <div className="row profile">
          <div className="col-md-12">
            <div className="card card-primary mt-4">
              <div className="card-header">
                <h3 className="card-title">Leaves</h3>
              </div>
              <div className="card-body">
                <div className="container">
                  <div className="row">
                    <div className="col-xl-12 mb-4 mb-xl-0">
                      <section>
                        <ul className="nav nav-tabs " id="myTab" role="tablist">
                          <li className="nav-item waves-effect waves-light">
                            <button
                              onClick={() => handleTabClick("applyleave")}
                            >
                              Apply Leave
                            </button>
                          </li>
                          <li className="nav-item waves-effect waves-light">
                            <button onClick={() => handleTabClick("leave")}>
                              Log
                            </button>
                          </li>
                        </ul>

                        {activeTab === "applyleave" && <ApplyLeave />}
                        {activeTab === "leave" && <LeaveLogs myLeaves={leavedata.data} />}
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="sidebar-navmenu" id="js-sidebar-navmenu">
              <div
                className="close-sidebar-navmenu"
                id="js-close-sidebar-navmenu"
              >
                <i className="fas fa-times"></i>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaves;
