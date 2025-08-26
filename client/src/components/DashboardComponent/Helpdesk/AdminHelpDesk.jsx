import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const AdminHelpDesk = () => {
  const navigate = useNavigate();
  const [helpdeskQuestion, setHelpdeskQuestion] = useState([]);
  const fetchhelpdeskQuestions = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/helpdesk`, {
      withCredentials: true,
    });
    setHelpdeskQuestion(response.data);
  };

  useEffect(() => {
    fetchhelpdeskQuestions();
  }, []);

  const handleEdittask = (questionID) => {
    navigate(`/public/employee/helpdesk/${questionID}`);
  };

  const handleDeletetask = async (questionID) => {
    await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/helpdesk/${questionID}`,
      { withCredentials: true }
    );
    fetchhelpdeskQuestions();
  };

  console.log("my questions are >>", helpdeskQuestion);
  return (
    <>
      <section className="content mt-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-primary helpDesk-show">
                <div className="card-header salary-slip-header d-flex justify-content-between align-items-center">
                  <h3 className="card-title">Help Desk</h3>
                  <Link
                    to="/public/employee/helpdesk-add"
                    className="btn btn-primary site-main-btn-2"
                  >
                    <i className="fa fa-plus"></i> Add
                  </Link>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped wg_salaryslip border-collapse">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Question</th>

                          <th>Category</th>
                          <th>Created By</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {helpdeskQuestion?.data?.map((item, index) => (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.question}</td>
                            <td>{item.category_name}</td>
                            <td>{item.created_by_name}</td>
                            <td>
                              <button
                                onClick={() => handleEdittask(item.id)}
                                className="btn btn-sm btn-primary"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeletetask(item.id)}
                                className="btn btn-sm btn-danger ms-2"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminHelpDesk;
