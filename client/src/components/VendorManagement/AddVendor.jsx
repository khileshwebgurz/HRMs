import { useEffect, useState } from "react";
import api from "../../../utils/api";

const AddVendor = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gst_no: "",
    country_id: "",
    state_id: "",
    city_id: "",
    zip: "",
    company_name: "",
    created_by: "",
    address: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

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


  // Handle input changes
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "country_id") {
      setFormData((prev) => ({ ...prev, state_id: "", city_id: "" }));
      setCities([]);
      try {
        const res = await api.get(`/inventory/states/${value}`);
        setStates(res.data);
      } catch (err) {
        console.error("Error fetching states", err);
      }
    }

    if (name === "state_id") {
      setFormData((prev) => ({ ...prev, city_id: "" }));
      try {
        const res = await api.get(`/inventory/cities/${value}`);
        setCities(res.data);
      } catch (err) {
        console.error("Error fetching cities", err);
      }
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/inventory/add-vendor-post", formData);
      console.log(res, 'resres');
      if (res.status === 200) {
        alert("Vendor added successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          gst_no: "",
          country_id: "",
          state_id: "",
          city_id: "",
          zip: "",
          company_name: "",
          created_by: "",
          address: "",
        });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add vendor.");
    }
  };

  return (
    <>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Add Vendor</h1>
            </div>
          </div>
        </div>
      </section>

      <div className="container-fluid">
        <div className="card add-user-sec py-4">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Name */}
                <div className="form-group col-md-6">
                  <label htmlFor="name">
                    Name<span className="req">*</span>
                  </label>
                  <input
                    className="form-control input-border"
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="form-group col-md-6">
                  <label htmlFor="email">
                    Email<span className="req">*</span>
                  </label>
                  <input
                    className="form-control input-border"
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="form-group col-md-6">
                  <label htmlFor="phone">
                    Phone<span className="req">*</span>
                  </label>
                  <input
                    className="form-control input-border"
                    type="text"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* GST No */}
                <div className="form-group col-md-6">
                  <label htmlFor="gst_no">GST No.</label>
                  <input
                    className="form-control input-border"
                    type="text"
                    name="gst_no"
                    id="gst_no"
                    value={formData.gst_no}
                    onChange={handleChange}
                  />
                </div>

                {/* Country */}
                <div className="form-group col-md-6">
                  <label htmlFor="country">
                    Country<span className="req">*</span>
                  </label>
                  <select
                    className="form-control input-border"
                    name="country_id"
                    id="country"
                    value={formData.country_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">--Select Country--</option>
                     {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                  </select>
                </div>

                {/* State */}
                <div className="form-group col-md-6">
                  <label htmlFor="state">
                    State<span className="req">*</span>
                  </label>
                  <select
                    className="form-control input-border"
                    name="state_id"
                    id="state"
                    value={formData.state_id}
                    onChange={handleChange}
                    required
                    disabled={!states.length}
                  >
                    <option value="">--Select State--</option>
                    {states.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                  </select>
                </div>

                {/* City */}
                <div className="form-group col-md-6">
                  <label htmlFor="city">City</label>
                  <select
                    className="form-control input-border"
                    name="city_id"
                    id="city"
                    value={formData.city_id}
                    onChange={handleChange}
                    disabled={!cities.length}
                  >
                    <option value="">--Select City--</option>
                    {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                  </select>
                </div>

                {/* Zip */}
                <div className="form-group col-md-6">
                  <label htmlFor="zip">Zip</label>
                  <input
                    className="form-control input-border"
                    type="number"
                    name="zip"
                    id="zip"
                    value={formData.zip}
                    onChange={handleChange}
                  />
                </div>

                {/* Company Name */}
                <div className="form-group col-md-6">
                  <label htmlFor="company_name">Company Name</label>
                  <input
                    className="form-control input-border"
                    type="text"
                    name="company_name"
                    id="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                  />
                </div>

                {/* Assign To */}
                <div className="form-group col-md-6">
                  <label htmlFor="created_by">
                    Assign To<span className="req">*</span>
                  </label>
                  <select
                    className="form-control input-border"
                    name="created_by"
                    id="created_by"
                    value={formData.created_by}
                    onChange={handleChange}
                    required
                  >
                    <option value="">--Select Employee--</option>
                    <option value="101">Employee 1</option>
                    <option value="102">Employee 2</option>
                  </select>
                </div>

                {/* Address */}
                <div className="form-group col-md-12">
                  <label htmlFor="address">Address</label>
                  <textarea
                    className="form-control input-border"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                {/* Submit */}
                <div className="form-group col-md-12">
                  <button
                    type="submit"
                    className="btn btn-success wgz-submit site-main-btn"
                  >
                    Add Vendor
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddVendor;
