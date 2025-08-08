import React, { useState, useEffect } from "react";

const ImportCandidate = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const [data, setData] = useState([]);
  const fetchdata = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/import-candidates`,
      {
        credentials: "include",
      }
    );
    const mydata = await res.json();
    setData(mydata);
  };

  useEffect(() => {
    fetchdata();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/import-candidates-post`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const result = await response.json();
      console.log("my result is >>>", result);
      if (result.status === "success") {
        alert("File uploaded successfully.");
      } else {
        alert(result.message || "Upload failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Upload error occurred.");
    }
  };

  console.log("my fetched data is >>>", data);

  return (
    <>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Bulk Candidate Import</h1>
            </div>
          </div>
        </div>
      </section>

      <div className="container-fluid">
        <div className="card add-user-sec">
          <div className="card-body">
            <div className="mr-1 wgz_user_form">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="col-lg-12">
                  <div className="card add-user-sec">
                    <div className="card-body">
                      <div className="form-group row">
                        <label
                          htmlFor="name"
                          className="col-md-4 col-form-label"
                        >
                          Upload CSV<span className="req">*</span>
                        </label>
                        <div className="col-md-8 bulk-btns">
                          <div className="form-icon">
                            <input
                              className="mt-2 mb-3 w-100 input-border"
                              type="file"
                              name="file"
                              accept=".csv,.xlsx"
                              id="file"
                              onChange={handleFileChange}
                            />
                            <i className="fas fa-file-alt"></i>
                          </div>
                          <div className="full-width">
                            <a
                              href="/csv-samples/candidate-example.csv"
                              target="_blank"
                              download
                            >
                              Download CSV Sample
                            </a>{" "}
                            |
                            <a
                              href="/csv-samples/candidate-example.xlsx"
                              target="_blank"
                              download
                            >
                              Download XLSX Sample
                            </a>
                          </div>

                          <input
                            className="btn btn-success float-right site-main-btn"
                            type="submit"
                            name="submit"
                            value="Upload"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <h5>Sorry!You don't have to import.Please Contact HR.</h5>
            <hr />

            <div className="col-lg-12 mt-5">
              <h3>List Import Files</h3>
              <div className="table-responsive">
                <table
                  id="example1"
                  className="table table-striped wg_allcron "
                >
                  <thead>
                    <tr>
                      <th>File</th>
                      <th>Total Rows</th>
                      <th>Success Rows</th>
                      <th>Fail Rows</th>
                      <th>Cron Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data?.length > 0 ? (
                      data?.data?.map((row) => (
                        <tr key={row.id}>
                          <td>{row.file}</td>
                          <td>{row.total_rows}</td>
                          <td>{row.success_rows}</td>
                          <td>{row.fail_rows}</td>
                          <td>{row.cron_status}</td>
                          <td>
                            {row.can_download ? (
                              <a
                                href={row.file_url}
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-warning"
                              >
                                Download
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">No data found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImportCandidate;


