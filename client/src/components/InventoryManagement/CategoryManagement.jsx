import React from "react";
import api from "../../../utils/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { Link } from "react-router-dom";
const CategoryManagement = () => {
  const navigate = useNavigate();
  const user = useUser();
  const [categories, setCategories] = useState([]);
  const fetchallcategories = async () => {
    const res = await api.get("/inventory/all-categories");
    setCategories(res.data.data);
  };
  useEffect(() => {
    fetchallcategories();
  }, []);

  const handleEditCategory = async (categoryID) => {
    navigate(`/public/inventory/all-categories/edit-category/${categoryID}`);
  };

  const handleDeleteCategory = async (categoryID) => {
    await api.delete(`/inventory/delete-category/${categoryID}`);
    fetchallcategories();
  };
  console.log(categories);
  return (
    <>
      {user.user_role !== "1" ? (
        <div className="container-fluid">
          <div className="card all-user-card">
            <div className="card-body">
              <h5>
                Sorry!You don't have permission to view. Please Contact Hr
              </h5>
            </div>
          </div>
        </div>
      ) : (
        <>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>All Categories</h1>
                </div>

                <div className="col-sm-6 text-right custom-btn-grp">
                  <Link
                    to="/public/inventory/all-categories/add-category"
                    className="btn btn-success btn-sm site-main-btn-2"
                  >
                    <i className="fas fa-plus"></i> Add New Category
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table
                    id="wgz_users_table"
                    className="table table-bordered table-striped wg_allusers"
                  >
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Category</th>
                        <th>Subcategory</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories && categories.length > 0 ? (
                        categories.map((cat, index) => (
                          <tr key={cat.id || index}>
                            <td>{index + 1}</td>
                            <td>{cat.parent_category}</td>
                            <td>{cat.category_name}</td>
                            <td>
                              <button
                                onClick={() => handleEditCategory(cat.id)}
                                className="btn btn-sm btn-primary"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="btn btn-sm btn-danger ms-2"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No categories found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CategoryManagement;
