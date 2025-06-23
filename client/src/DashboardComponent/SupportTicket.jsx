import React from "react";
import "../assets/css/ticket.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {useUser} from "../context/UserContext";
import AddTicketForm from "./TicketComponent/AddTicketForm";
const SupportTicket = () => {
  const user = useUser();
  const [tab, setTab] = useState("myticket");

  const [ticketdata, setTicketdata] = useState([]);
  const handleTabChange = (val) => {
    setTab(val);
  };

  useEffect(() => {
    const getTicket = async () => {
      const data = await axios.get('http://localhost:8000/api/ticketViewByEmployee',{withCredentials:true});
      setTicketdata(data.data);

    };
    getTicket();
  }, []);

  const handleAddTicket = async()=>{
    const data = await axios.post('http://localhost:8000/api/addTicket',)
  }
  console.log('my ticket data >>',ticketdata)

  return (
    <>
      <section className="content mt-4 support-ticket">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3">
              <div className="support-ticket-sidebar">
                <ul className="tabs">
                  <li
                    onClick={() => handleTabChange("myticket")}
                    className="tab-link current"
                    data-tab="tab-1"
                  >
                    <div className="tab-inner">
                      <span className="tab-name my-tickets">My Tickets</span>
                    </div>
                  </li>
                  <li
                    onClick={() => handleTabChange("newticket")}
                    className="tab-link"
                    data-tab="tab-2"
                  >
                    <Link to="">
                      <div className="tab-inner">
                        <span className="tab-name new-ticket">New Ticket</span>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            {tab === "myticket" && (
              <div className="col-lg-9">
                <div className="support-ticket-content">
                  <div id="tab-1" className="tab-content current">
                    <div className="card card-primary">
                      <div className="main-header card-header d-flex align-items-center">
                        <h3 className="card-title">My Tickets</h3>
                        <div className="card-actions  d-flex align-items-center">
                          <span
                            className="float-right d-flex align-items-center"
                            id="filter"
                          >
                            <input
                              type="text"
                              className="form-control"
                              name="datefilter"
                              // autocomplete="off"
                              placeholder="Select Filter Date"
                              // readonly
                            />
                          </span>

                          <select id="changestatus">
                            {/* @foreach($filterdata as $key=> $data)
                       <option value="{{$key}}">{{$data}}</option>
                       @endforeach */}
                          </select>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive mt-1">
                          <table className="table m wg_allinterviews tickets-list"></table>
                        </div>
                      </div>

                      <div className="card-footer"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "newticket" && (
             <AddTicketForm userRole={user.role_id}
             currentUserId={user.id}/>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default SupportTicket;
