import React, { useState } from "react";
 import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";

const ViewFormModal = ({ show, onClose, formId }) => {
  const [formData, setFormData] = useState([]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // Load form data when modal opens
  React.useEffect(() => {
    if (show && formId) {
      axios
        .post(`${API_BASE}/view-form`, { formid: formId }, { withCredentials: true })
        .then((res) => {
          if (res.data.success) {
            setFormData(res.data.form);
          } else {
            alert(res.data.error || "Failed to load form");
          }
        })
        .catch(() => alert("Error loading form"));
    }
  }, [show, formId]);

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Form Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {formData.length > 0 ? (
          <div className="row">
            {formData.map((field, idx) => {
              const heading = field.meta_key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
              return (
                <React.Fragment key={idx}>
                  <div className="col-sm-6">
                    <label>{heading}</label>
                  </div>
                  <div className="col-sm-6">
                    <h6 style={{ wordBreak: "break-word" }}>{field.meta_value}</h6>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        ) : (
          <p>No form data available.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewFormModal;
