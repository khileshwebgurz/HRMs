import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import api from "../../../utils/api";

const schema = Yup.object().shape({
  company_name: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed")
    .required("Company name is required"),

  domain_name: Yup.string()
    .matches(
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      "Invalid domain format"
    )
    .nullable()
    .notRequired(),

  facebook: Yup.string()
    .url("Invalid URL")
    .matches(
      /http(?:s):\/\/(?:www\.)facebook\.com\/.+/i,
      "Must be a valid Facebook profile/page URL"
    )
    .nullable()
    .notRequired(),

  instagram: Yup.string()
    .url("Invalid URL")
    .matches(
      /http(?:s):\/\/(?:www\.)instagram\.com\/.+/i,
      "Must be a valid Instagram profile URL"
    )
    .nullable()
    .notRequired(),

  linked_in: Yup.string()
    .url("Invalid URL")
    .matches(
      /http(?:s):\/\/(?:www\.)linkedin\.com\/.+/i,
      "Must be a valid LinkedIn profile URL"
    )
    .nullable()
    .notRequired(),

  twitter: Yup.string()
    .url("Invalid URL")
    .matches(
      /http(?:s):\/\/twitter\.com\/.+/i,
      "Must be a valid Twitter profile URL"
    )
    .nullable()
    .notRequired(),

  description: Yup.string().max(500, "Description too long"),
  registered_office_address: Yup.string().nullable(),
  corporate_office: Yup.string().nullable(),
  phone_nos: Yup.string().nullable(),
  emails: Yup.string().nullable(),
});

function CompanyProfileEdit() {
  const user = useUser();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      company_name: "",
      brand_name: "",
      website: "",
      domain_name: "",
      linked_in: "",
      twitter: "",
      facebook: "",
      description: "",
      registered_office_address: "",
      corporate_office: "",
      phone_nos: "",
      emails: "",
      logo: null,
    },
  });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const { data } = await api.get("/edit-company-profile");

        const company = data.data;
        Object.keys(company).forEach((key) => {
          setValue(key, company[key]);
        });
      } catch (error) {
        console.error("Error fetching company profile:", error);
      }
    };

    fetchCompany();
  }, [setValue]);

  const onSubmit = async (formData) => {
    try {
      const res = await api.post("/edit-company-profile-post", formData);
      console.log("my post profile is >>", res.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Edit Company Profile</h1>
            </div>
            <div className="col-sm-6 text-right"></div>
          </div>
        </div>
      </section>
      {user?.user_role !== "1" ? (
        <h5>Sorry!You don't have permission to Edit. Please Contact Hr</h5>
      ) : (
        <div className="container-fluid">
          <div className="card add-user-sec">
            <div className="card-body">
              <div className="row1 mr-1 wgz_category_form wgz_form">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  encType="multipart/form-data"
                >
                  <input type="hidden" name="company_id" value="" />
                  <div className="card shadow-none">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label
                              for="name"
                              className="col-2 col-form-label sr-only"
                            >
                              Company Name
                            </label>
                            <div className="col-12 form-icon">
                              <input
                                className="form-control"
                                {...register("company_name")}
                                name="company_name"
                                placeholder="Company Name"
                              />
                              <p className="text-danger">
                                {errors.company_name?.message}
                              </p>
                              <i className="far fa-building"></i>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label
                              for="name"
                              className="col-2 col-form-label sr-only"
                            >
                              Brand Name
                            </label>
                            <div className="col-12 form-icon">
                              <input
                                className="form-control"
                                {...register("brand_name")}
                                placeholder="Brand Name"
                              />
                              <p className="text-danger">
                                {errors.brand_name?.message}
                              </p>
                              <i className="far fa-copyright"></i>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label
                              for="name"
                              className="col-2 col-form-label sr-only"
                            >
                              Website Name
                            </label>
                            <div className="col-12 form-icon">
                              <input
                                className="form-control"
                                type="text"
                                {...register("website")}
                                placeholder="Website Name"
                              />
                              <p className="text-danger">
                                {errors.website?.message}
                              </p>
                              <i className="fas fa-globe"></i>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label
                              for="name"
                              className="col-2 col-form-label sr-only"
                            >
                              Domain Name
                            </label>
                            <div className="col-12 form-icon">
                              <input
                                className="form-control"
                                type="text"
                                {...register("domain_name")}
                                maxlength="25"
                                placeholder="Domain Name"
                              />
                              <p className="text-danger">
                                {errors.domain_name?.message}
                              </p>
                              <i className="fas fa-location-arrow"></i>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label
                              for="name"
                              className="col-2 col-form-label sr-only"
                            >
                              LinkedIn
                            </label>
                            <div className="col-12 form-icon">
                              <input
                                className="form-control"
                                type="text"
                                {...register("linked_in")}
                                placeholder="LinkedIn"
                              />
                              <p className="text-danger">
                                {errors.linked_in?.message}
                              </p>
                              <i className="fab fa-linkedin"></i>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label
                              for="name"
                              className="col-2 col-form-label sr-only"
                            >
                              Twitter
                            </label>
                            <div className="col-12 form-icon">
                              <input
                                className="form-control"
                                type="text"
                                {...register("twitter")}
                                placeholder="Twitter"
                              />
                              <p className="text-danger">
                                {errors.twitter?.message}
                              </p>
                              <i className="fab fa-twitter-square"></i>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label
                              for="name"
                              className="col-2 col-form-label sr-only"
                            >
                              Facebook
                            </label>
                            <div className="col-12 form-icon">
                              <input
                                className="form-control"
                                type="text"
                                {...register("facebook")}
                                placeholder="Facebook"
                              />
                              <p className="text-danger">
                                {errors.facebook?.message}
                              </p>
                              <i className="fab fa-facebook-square"></i>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label
                              for="name"
                              className="col-2 col-form-label sr-only"
                            >
                              Description
                            </label>
                            <div className="col-12 form-icon">
                              <input
                                className="form-control"
                                type="text"
                                {...register("description")}
                                placeholder="Description"
                              />
                              <p className="text-danger">
                                {errors.description?.message}
                              </p>
                              <i className="fas fa-align-left"></i>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label
                              for="name"
                              className="col-2 col-form-label sr-only"
                            >
                              Registered Office
                            </label>
                            <div className="col-12 form-icon">
                              <input
                                className="form-control"
                                type="text"
                                {...register("registered_office_address")}
                                placeholder="Registered Office"
                              />
                              <p className="text-danger">
                                {errors.registered_office_address?.message}
                              </p>
                              <i className="far fa-building"></i>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label
                              for="name"
                              className="col-2 col-form-label sr-only"
                            >
                              Corporate Office
                            </label>
                            <div className="col-12 form-icon">
                              <input
                                className="form-control"
                                type="text"
                                {...register("corporate_office")}
                                placeholder="Corporate Office"
                              />
                              <p className="text-danger">
                                {errors.corporate_office?.message}
                              </p>
                              <i className="far fa-building"></i>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label
                              for="name"
                              className="col-2 col-form-label sr-only"
                            >
                              Important Phone no.
                            </label>
                            <div className="col-12 form-icon">
                              <textarea
                                className="form-control"
                                name="phone_nos"
                                placeholder="phone no."
                                {...register("phone_nos")}
                              ></textarea>
                              <p className="text-danger">
                                {errors.phone_nos?.message}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label
                              for="name"
                              className="col-2 col-form-label sr-only"
                            >
                              Important Emails
                            </label>
                            <div className="col-12 form-icon">
                              <textarea
                                className="form-control"
                                placeholder="email"
                                {...register("emails")}
                              ></textarea>
                              <p className="text-danger">
                                {errors.emails?.message}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group row">
                            <label
                              for="name"
                              className="col-2 col-form-label sr-only"
                            >
                              logo
                            </label>
                            <div className="col-12 form-icon">
                              <input
                                className="form-control"
                                type="file"
                                {...register("logo")}
                                id="logo"
                                accept=".png,.jpg,.jpeg"
                                placeholder="logo"
                              />
                              <p className="text-danger">
                                {errors.logo?.message}
                              </p>
                              <i className="fas fa-file-alt"></i>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="btn-action mt-5 text-center">
                            <button
                              className="btn btn-primary wgz-submit py-2 px-4 py-md-3 px-md-5 mr-3"
                              type="submit"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CompanyProfileEdit;
