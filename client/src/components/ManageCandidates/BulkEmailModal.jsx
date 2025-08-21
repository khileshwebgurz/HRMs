import React, { useState } from "react";
import Modal from "react-bootstrap/Modal"; // or any modal lib
import Button from "react-bootstrap/Button";
import axios from "axios";

const BulkEmailModal = ({ show, onClose, emails, refreshList }) => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

 const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("email_to", emails);
  formData.append("email_subject", subject);
  formData.append("email_content", content);

  if (files && files.length > 0) { // ✅ Only append when not empty
    for (let i = 0; i < files.length; i++) {
      formData.append("attachment[]", files[i]);
    }
  }

  try {
    const res = await axios.post(`${API_BASE}/bulk-send-email-submit`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.data.status === 200) {
      alert(res.data.message);
      onClose();
      refreshList();
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Failed to send email");
  }
};


  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Send Bulk Email</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>To</label>
            <input className="form-control" value={emails} readOnly />
          </div>
          <div className="mb-3">
            <label>Subject</label>
            <input
              className="form-control"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Message</label>
            <textarea
              className="form-control"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label>Attachments</label>
            <input
              type="file"
              className="form-control"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
          </div>
          <Button variant="primary" type="submit">
            Send
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default BulkEmailModal;
