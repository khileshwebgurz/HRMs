import React from "react";
import { Link } from "react-router-dom";

const LeftSideBar = (handleTabChange) => {
  return (
    <>
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
    </>
  );
};

export default LeftSideBar;
