import React from "react";
import { Link } from "react-router-dom";
const TicketReports = () => {
  return (
    <>
     
        <div className="row">
          {/* <div className="col-md-3">
            <div className="support-ticket-sidebar">
              <ul className="tabs" id="tabs">
                <li className="tab-link " data-tab="tab-1">
                  <Link to="/employee/ticket-system/alltickets">
                    <div className="tab-inner">
                      <span className="tab-name my-tickets">All Tickets</span>
                    </div>
                  </Link>
                </li>
                <li className="tab-link" data-tab="tab-2">
                  <Link to="/employee/support-ticket/newticket">
                    <div className="tab-inner">
                      <span className="tab-name new-ticket">New Ticket</span>
                    </div>
                  </Link>
                </li>
                <li className="tab-link current" data-tab="tab-2">
                 <Link to="/employee/ticket-system/reports">
                  <div className="tab-inner">
                    <span className="tab-name new-ticket">Reports</span>
                  </div>
                </Link>
                </li>
              </ul>
            </div>
          </div> */}

          <div className="col-md-9">
            <div className="support-ticket-sidebar">
              <div className="card card-primary">
                <div className="main-header card-header d-flex align-items-center">
                  <h3 className="card-title">Reports</h3>
                  <div className="card-actions  d-flex align-items-center">
                    <div
                      id="reportrange"
                      style={{
                        cursor: "pointer",
                        padding: "0px 10px",
                        border: "1px solid rgba(255,255,255,.5)",
                      }}
                    >
                      <i className="fa fa-calendar"></i>&nbsp;
                      <span></span> <i className="fa fa-caret-down"></i>
                    </div>
                  </div>
                </div>
                <div className="card-body" id="message">
                  <figure className="highcharts-figure">
                    <span>
                      <b>Total:- </b>
                      <span id="countall"> </span>{" "}
                    </span>
                    <span className="float-right">
                      <b>Total Average:- </b>
                      <span id="countage"> </span>{" "}
                    </span>
                    <div id="container"></div>
                    <span>
                      <b>P1- Service Unuseable in Production:- </b>
                      <span id="countp1"> </span>{" "}
                    </span>
                    <br />
                    <span>
                      <b>P2- Service Partially not working:- </b>
                      <span id="countp2"> </span>{" "}
                    </span>
                    <br />
                    <span>
                      <b>P3- Service Partially Impaired:- </b>
                      <span id="countp3"> </span>{" "}
                    </span>
                    <br />
                    <span>
                      <b>P4- Service Useable:- </b>
                      <span id="countp4"> </span>{" "}
                    </span>
                  </figure>
                </div>
                <div className="card-footer" id="cout"></div>
              </div>
            </div>
          </div>
        </div>
     
      {/* <div className="sidebar-navmenu" id="js-sidebar-navmenu">
        <div className="close-sidebar-navmenu" id="js-close-sidebar-navmenu">
          <i className="fas fa-times"></i>
        </div>
      </div> */}
    </>
  );
};

export default TicketReports;
