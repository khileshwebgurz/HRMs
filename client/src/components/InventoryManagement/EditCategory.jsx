import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../utils/api";

const EditCategory = () => {
  const { categoryID } = useParams();

  const [formData, setFormData] = useState({
    parent_category_id: "",
    category_name: "",
  });

  const [parentCategories, setParentCategories] = useState([]);

  // Fetch category + parent list
  const fetchEditCategory = async () => {
    try {
      const res = await api.get(
        `/inventory/all-categories/edit-category/${categoryID}`
      );
      if (res.data.success) {
        setFormData({
          parent_category_id: res.data.name || "",
          category_name: res.data.category.category_name || "",
        });
        setParentCategories(res.data.categoryId || []);
      }
    } catch (err) {
      console.error("Error fetching category:", err);
    }
  };

  console.log("my formdata ", formData);

  useEffect(() => {
    fetchEditCategory();
  }, [categoryID]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/inventory/edit-category-post", {
        cat_id: categoryID,
        ...formData,
      });

      if (res?.data?.status == 200) {
        alert("Category updated successfully!");
      } else {
        alert("Failed to update category.");
      }
    } catch (err) {
      console.error("Error updating category:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Edit Category</h1>
            </div>
          </div>
        </div>
      </section>

      <div className="container-fluid">
        <div className="card add-user-sec">
          <div className="card-body">
            <form onSubmit={handleSubmit} id="wgz_user_form">
              <div className="row">
                <div className="col-lg-12">
                  <div className="card shadow-none">
                    <div className="card-body p-0">
                      <div className="row">
                        {/* Parent Category Dropdown */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-12 col-form-label mx-auto">
                              Category Name
                              <div>
                                <select
                                  className="form-control input-border pl-0"
                                  name="parent_category_id"
                                  value={formData.parent_category_id}
                                  onChange={handleChange}
                                >
                                  <option value="">Select Category</option>
                                  {parentCategories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                      {cat.category_name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </label>
                          </div>
                        </div>

                        {/* Subcategory Input */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-12 col-form-label mx-auto">
                              Subcategory Name <span className="req">*</span>
                              <div className="form-icon">
                                <input
                                  className="form-control input-border pl-0"
                                  type="text"
                                  name="category_name"
                                  value={formData.category_name}
                                  onChange={handleChange}
                                  maxLength="25"
                                  required
                                />
                                <img
                                  src="/hrm/public/dist/img/2021/icons/name-icon.png"
                                  alt=""
                                />
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="main-btn-wrap">
                    <button
                      type="submit"
                      className="btn btn-success float-right wgz-submit site-main-btn"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditCategory;
