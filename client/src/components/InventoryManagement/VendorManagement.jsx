import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/api";
import { useNavigate } from "react-router-dom";
const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();

  const fetchAllVendors = async () => {
    const res = await api.get("/inventory/all-vendors");
    setVendors(res.data.vendors);
  };

  useEffect(() => {
    fetchAllVendors();
  }, []);

  const handlebtnClick = (id) => {
    navigate(`/public/inventory/all-vendors/edit-vendor/${id}`);
  };

  const handleDelete = async (id) => {
    await api.get(`inventory/delete-vendor/${id}`);
    fetchAllVendors();
  };
  console.log("the vendors are >>>", vendors);
  return (
    <>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>All Vendors</h1>
            </div>
            <div className="col-sm-6 text-right custom-btn-grp">
              <Link
                to="/public/inventory/all-vendors/add-vendor"
                className="btn btn-success btn-sm site-main-btn-2"
              >
                <i className="fas fa-plus"></i> Add New Vendor
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
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone No</th>
                    <th>Company Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors?.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td>{item.company_name}</td>
                      <td>
                        {/* Example actions */}
                        {item.can_edit && (
                          <button
                            onClick={() => handlebtnClick(item.id)}
                            className="btn btn-sm btn-primary"
                          >
                            Edit
                          </button>
                        )}
                        {item.can_delete && (
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="btn btn-sm btn-danger"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorManagement;
