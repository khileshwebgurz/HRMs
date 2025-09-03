import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import api from "../../../utils/api";

const EditVendor = () => {
  const user = useUser();
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Fetch vendor by ID
  const fetchVendor = async () => {
    try {
      const res = await api.get(`/inventory/all-vendors/edit-vendor/${id}`);

      // Flatten the vendor object
      const v = res.data.vendor;
      setVendor({
        id: v.id,
        name: v.name,
        email: v.email,
        phone: v.phone,
        company_name: v.company_name,
        gst_no: v.gst_no,
        zip: v.zip,
        address: v.address,
        country_id: res.data.country_id,
        state_id: res.data.state_id,
        city_id: res.data.city_id,
      });

      // Preload states & cities based on vendor’s current country/state
      if (res.data.country_id) {
        const stateRes = await api.get(`/inventory/states/${res.data.country_id}`);
        setStates(stateRes.data);
      }
      if (res.data.state_id) {
        const cityRes = await api.get(`/inventory/cities/${res.data.state_id}`);
        setCities(cityRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch vendor:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all countries once
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await api.get("/inventory/countries");
        setCountries(res.data);
      } catch (err) {
        console.error("Error fetching countries", err);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    fetchVendor();
  }, [id]);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setVendor((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "country_id") {
      setVendor((prev) => ({ ...prev, state_id: "", city_id: "" }));
      setCities([]);
      try {
        const res = await api.get(`/inventory/states/${value}`);
        setStates(res.data);
      } catch (err) {
        console.error("Error fetching states", err);
      }
    }

    if (name === "state_id") {
      setVendor((prev) => ({ ...prev, city_id: "" }));
      try {
        const res = await api.get(`/inventory/cities/${value}`);
        setCities(res.data);
      } catch (err) {
        console.error("Error fetching cities", err);
      }
    }
  };

  const handleSubmitVendor = async (e) => {
    e.preventDefault();
    try {
        console.log('my vendor is >>> ',vendor)
      const res = await api.post("/inventory/edit-vendor-post", vendor);

      if (res.data.status === 200) {
        alert("Vendor updated successfully!");
      } else {
        alert(res.data.message || "Failed to update vendor.");
      }
    } catch (error) {
      console.error("Error updating vendor:", error);
      alert("Something went wrong.");
    }
  };

  if (loading || !vendor) return <p>Loading...</p>;

  return (
    <>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Edit Vendor</h1>
            </div>
          </div>
        </div>
      </section>

      {user.user_role !== "1" ? (
        <h5>Sorry! You don't have permission to view. Please Contact HR</h5>
      ) : (
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmitVendor}>
              <input type="hidden" name="vendor_id" value={vendor.id} />

              {/* Name */}
              <div className="form-group row">
                <label className="col-2 col-form-label">Name<span className="req">*</span></label>
                <div className="col-5">
                  <input
                    className="form-control"
                    type="text"
                    value={vendor.name || ""}
                    onChange={handleInputChange}
                    name="name"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group row">
                <label className="col-2 col-form-label">Email<span className="req">*</span></label>
                <div className="col-5">
                  <input
                    className="form-control"
                    type="text"
                    value={vendor.email || ""}
                    onChange={handleInputChange}
                    name="email"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="form-group row">
                <label className="col-2 col-form-label">Phone</label>
                <div className="col-5">
                  <input
                    className="form-control"
                    type="text"
                    value={vendor.phone || ""}
                    onChange={handleInputChange}
                    name="phone"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="form-group row">
                <label className="col-2 col-form-label">Address</label>
                <div className="col-5">
                  <textarea
                    className="form-control"
                    name="address"
                    value={vendor.address || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* GST */}
              <div className="form-group row">
                <label className="col-2 col-form-label">GST No</label>
                <div className="col-5">
                  <input
                    className="form-control"
                    type="text"
                    value={vendor.gst_no || ""}
                    onChange={handleInputChange}
                    name="gst_no"
                  />
                </div>
              </div>

              {/* Country */}
              <div className="form-group row">
                <label className="col-2 col-form-label">Country</label>
                <div className="col-5">
                  <select
                    className="form-control"
                    name="country_id"
                    value={vendor.country_id || ""}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Country</option>
                    {countries.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* State */}
              <div className="form-group row">
                <label className="col-2 col-form-label">State</label>
                <div className="col-5">
                  <select
                    className="form-control"
                    name="state_id"
                    value={vendor.state_id || ""}
                    onChange={handleInputChange}
                  >
                    <option value="">Select State</option>
                    {states.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* City */}
              <div className="form-group row">
                <label className="col-2 col-form-label">City</label>
                <div className="col-5">
                  <select
                    className="form-control"
                    name="city_id"
                    value={vendor.city_id || ""}
                    onChange={handleInputChange}
                  >
                    <option value="">Select City</option>
                    {cities.map((ct) => (
                      <option key={ct.id} value={ct.id}>
                        {ct.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Zip */}
              <div className="form-group row">
                <label className="col-2 col-form-label">Zip</label>
                <div className="col-5">
                  <input
                    className="form-control"
                    type="number"
                    value={vendor.zip || ""}
                    name="zip"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Company */}
              <div className="form-group row">
                <label className="col-2 col-form-label">Company</label>
                <div className="col-5">
                  <input
                    className="form-control"
                    type="text"
                    value={vendor.company_name || ""}
                    name="company_name"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <input
                className="btn btn-success float-right"
                type="submit"
                value="Save Changes"
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditVendor;
