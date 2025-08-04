import React from "react";

const LanguageProficiency = () => {
  return (
    <>
      <div className="card">
        <div className="card-header">
          Language Profeiciency
          <a
            className="btn btn-primary btn-sm float-right add-language"
            data-added="0"
          >
            <i className="fas fa-plus"></i> Add Row
          </a>
        </div>
        <div className="card-body">
          <table className="table table-bordered " id="wgz_language">
            <thead>
              <tr>
                <th width="2%">S No.</th>
                <th width="10%">LANGUAGES</th>
                <th width="10%">SPEAK</th>
                <th width="10%">WRITE</th>
                <th width="10%">UNDERSTAND</th>
                <th width="5%">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr id="rec-language-{{$l}}">
                <td>
                  <span className="sn"></span>
                </td>
                <td>
                  <select
                    className="custom-select wgz_english_id"
                    name="candidate_languages[english_id][<?php echo $l; ?>]"
                  >
                    <option value="">Language...</option>
                    <option value="{{$langk}}"></option>
                  </select>
                </td>
                <td>
                  <div className="form-check form-check-inline">
                    <label className="form-check-label">
                      {" "}
                      <input
                        className="form-check-input wgz_speak"
                        type="radio"
                        name="candidate_languages[speak][<?php echo $l; ?>]"
                        value="1"
                      />{" "}
                      Yes
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <label className="form-check-label">
                      {" "}
                      <input
                        className="form-check-input wgz_speak"
                        type="radio"
                        name="candidate_languages[speak][<?php echo $l; ?>]"
                        value="0"
                      />{" "}
                      No
                    </label>
                  </div>
                </td>
                <td>
                  <div className="form-check form-check-inline">
                    <label className="form-check-label">
                      {" "}
                      <input
                        className="form-check-input wgz_write"
                        type="radio"
                        name="candidate_languages[write][<?php echo $l; ?>]"
                        value="1"
                      />{" "}
                      Yes
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <label className="form-check-label">
                      {" "}
                      <input
                        className="form-check-input wgz_write"
                        type="radio"
                        name="candidate_languages[write][<?php echo $l; ?>]"
                        value="0"
                      />{" "}
                      No
                    </label>
                  </div>
                </td>
                <td>
                  <div className="form-check form-check-inline">
                    <label className="form-check-label">
                      {" "}
                      <input
                        className="form-check-input wgz_understand"
                        type="radio"
                        name="candidate_languages[understand][<?php echo $l; ?>]"
                        value="1"
                      />{" "}
                      Yes
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <label className="form-check-label">
                      {" "}
                      <input
                        className="form-check-input wgz_understand"
                        type="radio"
                        name="candidate_languages[understand][<?php echo $l; ?>]"
                        value="0"
                      />{" "}
                      No
                    </label>
                  </div>
                </td>
                <td>
                  <a
                    className="btn btn-xs delete-record-language"
                    data-id="<?php echo $l; ?>"
                  >
                    <i className="fas fa-trash"></i>
                  </a>
                </td>
              </tr>

              <tr>
                <td>
                  <span className="sn">1</span>
                </td>
                <td>
                  <select
                    className="custom-select wgz_english_id"
                    name="candidate_languages[english_id][1]"
                  >
                    <option value="">Language...</option>
                    <option value="1">English</option>
                    <option value="2">Hindi</option>
                    <option value="3">Punjabi</option>
                  </select>
                </td>
                <td>
                  <div className="form-check form-check-inline">
                    <label className="form-check-label">
                      {" "}
                      <input
                        className="form-check-input wgz_speak"
                        type="radio"
                        checked
                        name="candidate_languages[speak][1]"
                        value="1"
                      />{" "}
                      Yes
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <label className="form-check-label">
                      {" "}
                      <input
                        className="form-check-input wgz_speak"
                        type="radio"
                        name="candidate_languages[speak][1]"
                        value="0"
                      />{" "}
                      No
                    </label>
                  </div>
                </td>
                <td>
                  <div className="form-check form-check-inline">
                    <label className="form-check-label">
                      {" "}
                      <input
                        className="form-check-input wgz_write"
                        type="radio"
                        checked
                        name="candidate_languages[write][1]"
                        value="1"
                      />{" "}
                      Yes
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <label className="form-check-label">
                      {" "}
                      <input
                        className="form-check-input wgz_write"
                        type="radio"
                        name="candidate_languages[write][1]"
                        value="0"
                      />{" "}
                      No
                    </label>
                  </div>
                </td>
                <td>
                  <div className="form-check form-check-inline">
                    <label className="form-check-label">
                      {" "}
                      <input
                        className="form-check-input wgz_understand"
                        type="radio"
                        checked
                        name="candidate_languages[understand][1]"
                        value="1"
                      />
                      Yes
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <label className="form-check-label">
                      {" "}
                      <input
                        className="form-check-input wgz_understand"
                        type="radio"
                        value="0"
                      />{" "}
                      No
                    </label>
                  </div>
                </td>
                <td>
                  <a
                    className="btn btn-xs delete-record-language"
                    style={{ display: "none" }}
                    data-id="0"
                  >
                    <i className="fas fa-trash"></i>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default LanguageProficiency;
