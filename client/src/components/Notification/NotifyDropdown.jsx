import React from "react";
import { Link } from "react-router-dom";
import moment from "moment"; 

const NotifyDropdown = ({ notification }) => {
  return (
    <div
      className="dropdown-menu dropdown-menu-lg dropdown-menu-right show shadow"
      style={{ right: 0, left: "auto", minWidth: "300px", maxHeight: "400px", overflowY: "auto" }}
    >
      {notification.length === 0 ? (
        <span className="dropdown-item text-center text-muted">
          No notifications
        </span>
      ) : (
        <>
          {notification.map((note, index) => (
            <Link
              key={index}
              to={note.link || "#"}
              className="dropdown-item d-flex flex-column border-bottom pb-2"
              style={{ whiteSpace: "normal" }}
            >
              <span className="d-flex align-items-start">
                <span
                  style={{
                    height: "6px",
                    width: "6px",
                    backgroundColor: "#000",
                    borderRadius: "50%",
                    marginTop: "6px",
                    marginRight: "6px",
                  }}
                ></span>
                <span>{note.message}</span>
              </span>
              <small className="text-muted mt-1">
                {moment(note.created_at).fromNow()}
              </small>
            </Link>
          ))}
          <div className="dropdown-divider m-0" />
          <Link
            to="/notifications"
            className="dropdown-item text-center font-weight-bold"
          >
            See All Notifications
          </Link>
        </>
      )}
    </div>
  );
};

export default NotifyDropdown;
