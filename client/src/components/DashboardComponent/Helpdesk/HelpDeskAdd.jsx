import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../../context/UserContext";

const HelpDeskAdd = () => {
    const user = useUser();
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
    created_by: user.id
  });
  const [categories, setCategories] = useState([]);

  // Fetch categories from Laravel API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/helpdeskadd`, {
          withCredentials: true,
        });
        // since your Laravel response is { status, data }
        setCategories(res.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/helpdesk`,
        formData,
        { withCredentials: true }
      );

      alert("Helpdesk entry created successfully!");
      console.log("Response:", res.data);

      // Reset form
      setFormData({ question: "", answer: "", category: "" });
    } catch (error) {
      console.error("Error submitting helpdesk entry:", error);
      alert("Failed to submit. Please try again.");
    }
  };

  return (
    <section className="content mt-4">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-primary helpDesk-add">
              <div className="card-header">
                <h3 className="card-title">Help Desk</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {/* Question */}
                  <div className="form-group">
                    <label htmlFor="question">Question</label>
                    <input
                      type="text"
                      className="form-control"
                      id="question"
                      name="question"
                      value={formData.question}
                      onChange={handleChange}
                      placeholder="Enter Question"
                      required
                    />
                  </div>

                  {/* Answer */}
                  <div className="form-group">
                    <label htmlFor="answer">Answer</label>
                    <textarea
                      className="form-control"
                      name="answer"
                      rows="3"
                      value={formData.answer}
                      onChange={handleChange}
                      placeholder="Enter Answer"
                      required
                    ></textarea>
                  </div>

                  {/* Category */}
                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                      className="form-control"
                      name="category"
                      id="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button type="submit" className="btn btn-info">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpDeskAdd;
