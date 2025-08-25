import moment from "moment";
import { notificationdata } from "./notificationdata";
import { useState, useEffect } from "react";
// import bellIcon from "../assets/bell-icon.png";
const AllNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const today = moment().format("YYYY-MM-DD");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationdata(); // fetch the data
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const grouped = {
    today: [],
    earlier: [],
  };

  notifications.forEach((note) => {
    const date = moment(note.created_at).format("YYYY-MM-DD");
    if (date === today) {
      grouped.today.push(note);
    } else {
      grouped.earlier.push(note);
    }
  });
  const renderGroup = (title, notes) => (
    <>
      <div className="bg-info text-white px-3 py-2 font-weight-bold">
        {title}
      </div>
      {notes.map((note, index) => (
        <div
          key={index}
          className="d-flex align-items-start justify-content-between border-bottom p-3"
        >
          <div className="d-flex">
            {/* <img
              src={bellIcon}
              alt="icon"
              style={{ width: "24px", height: "24px", marginRight: "10px" }}
            /> */}
            <div>
              <div className="font-weight-bold">{note.message}</div>
              <div className="text-muted small">
                {moment(note.created_at).format("DD MMM YYYY, hh:mm a")}
              </div>
            </div>
          </div>
          <button
            className="btn btn-link text-dark p-0"
            onClick={() => handleDelete(note.id)}
            title="Delete"
          >
            ×
          </button>
        </div>
      ))}
    </>
  );

  return (
    <div className="container py-4">
      <h3 className="mb-4">All Notifications</h3>
      <div className="bg-white border rounded shadow-sm">
        {grouped.today.length > 0 && renderGroup("Today", grouped.today)}
        {grouped.earlier.length > 0 && renderGroup("Earlier", grouped.earlier)}
        {notifications.length === 0 && (
          <div className="text-center text-muted p-4">
            No notifications available.
          </div>
        )}
      </div>
    </div>
  );
};

export default AllNotification;
