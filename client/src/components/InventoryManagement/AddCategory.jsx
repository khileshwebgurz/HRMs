import { useState, useEffect } from "react";
import api from "../../../utils/api";

const AddCategory = () => {
  const [data, setData] = useState({
    categories: [],
    parent: null,
    roles: null,
    assign: [],
  });

  // Form state
  const [form, setForm] = useState({
    parent_category_id: "",
    category_name: "",
    created_by: "",
  });

  // Fetch all required data
  const fetchCategoryList = async () => {
    try {
      const res = await api.get("inventory/all-categories/add-category");
      setData(res.data);

      if (res.data.parent) {
        setForm((prev) => ({
          ...prev,
          parent_category_id: res.data.parent.id,
        }));
      }
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("inventory/add-category-post", form);
      if (res.data.status) {
        alert(res.data.message || "Category added successfully");
      } else {
        alert(res.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error submitting form", err);
    }
  };

  return (
    <>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Add Category</h1>
            </div>
            <div className="col-sm-6 text-right"></div>
          </div>
        </div>
      </section>

      <div className="container-fluid">
        <div className="card add-user-sec py-4">
          <div className="card-body">
            <div className="wgz_category_form row">
              <div className="col-12">
                <form id="wgz_category_form" onSubmit={handleSubmit}>
                  <div className="row">
                    {/* Category Dropdown */}
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Category Name</label>
                        <select
                          className="form-control input-border"
                          name="parent_category_id"
                          value={form.parent_category_id}
                          onChange={handleChange}
                        >
                          <option value="">-Select Category-</option>
                          {data.categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.category_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Subcategory Input */}
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>
                          Subcategory Name<span className="req">*</span>
                        </label>
                        <input
                          className="form-control input-border"
                          type="text"
                          name="category_name"
                          value={form.category_name}
                          onChange={handleChange}
                          maxLength="25"
                          required
                        />
                      </div>
                    </div>

                    {/* Assign Dropdown */}
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>
                          Assign<span className="req">*</span>
                        </label>
                        <select
                          className="form-control input-border"
                          name="created_by"
                          value={form.created_by}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Assign to</option>
                          {data.assign.map((emp) => (
                            <option key={emp.id} value={emp.id}>
                              {emp.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="btn-option text-center mt-4">
                    <button
                      type="submit"
                      className="btn btn-success wgz-submit site-main-btn"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal (still here if you need it later) */}
      <div
        className="modal fade show"
        id="wgz_bulk_import"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title wgz_title">Add Category</h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCategory;
