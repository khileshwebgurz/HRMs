import React, { useEffect } from "react";
import axios from "axios";

function Notifications() {
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/notifications") 
      .then((response) => {
        console.log("Notifications Response:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
  }, []);

  return (
    <div>
      <h2>Notifications Component</h2>
      <p>Check the console for API response.</p>
    </div>
  );
}

export default Notifications;
