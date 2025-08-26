import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../../context/UserContext";
const EditHelpDesk = () => {
  const user = useUser();
  const { questionID } = useParams();
  const [question, setQuestion] = useState([]);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
    created_by: user.id,
  });
  const fetchIdquestion = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/helpdesk/${questionID}`,
      { withCredentials: true }
    );
    setQuestion(res.data);
  };
  useEffect(() => {
    fetchIdquestion();
  }, []);

  useEffect(() => {
    if (question?.helpdesk) {
      setFormData({
        question: question.helpdesk.question || "",
        answer: question.helpdesk.answer || "",
        category: question.helpdesk.category || "",
        created_by: user.id,
      });
    }
  }, [question]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    const response = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/helpdesk/${questionID}`,
      formData,
      { withCredentials: true }
    );

    console.log('my updated data is ',response.data)
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  return (
    <>
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
                        {question?.categories?.map((cat) => (
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
    </>
  );
};

export default EditHelpDesk;
