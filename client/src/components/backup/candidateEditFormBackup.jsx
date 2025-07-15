import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const CandidateEditForm = () => {
  const { candidate_id } = useParams();
  const navigate = useNavigate();

  // State for form data
  const [formData, setFormData] = useState({
    candidate_id: candidate_id,
    position: "",
    department: "",
    full_name: "",
    mobile_number: "",
    email: "",
    gender: "1",
    passport_number: "",
    residence_address: "",
    marital_status: "1",
    nationality: "",
    dob: "",
    age: "",
    place_of_birth: "",
    hobbies: "",
    status: "",
    remarks: "",
    date_of_interview: "",
    interview_score: "",
    interviewed_by: "",
    sourcing: "",
    current_salary: "",
    expected_salary: "",
    offered_salary: "",
    skill_name: [],
  });

  // State for tags input
  const [tagInput, setTagInput] = useState("");

  // State for dynamic sections
  const [educations, setEducations] = useState([
    {
      institute_name: "",
      from: "",
      to: "",
      professional_qualification: "",
    },
  ]);

  const [languages, setLanguages] = useState([
    {
      language_id: "",
      speak: "1",
      write: "1",
      understand: "1",
    },
  ]);

  const [employments, setEmployments] = useState([
    {
      company_name: "",
      address: "",
      contact_details: "",
      date_from: "",
      date_to: "",
      position: "",
      reason_of_leaving: "",
    },
  ]);

  const [families, setFamilies] = useState([
    {
      name: "",
      relationship: "",
      age: "",
      occupation: "",
      name_of_employer: "",
    },
  ]);

  const [otherInformations, setOtherInformations] = useState([]);
  const [assessments, setAssessments] = useState({
    1: {
      interviewer_name: "",
      education: "",
      experince: "",
      attitude: "",
      stability: "",
      technical_skills: "",
      appearance_personality: "",
      skills: "",
    },
    2: {
      interviewer_name: "",
      education: "",
      experince: "",
      attitude: "",
      stability: "",
      technical_skills: "",
      appearance_personality: "",
      skills: "",
    },
    3: {
      interviewer_name: "",
      education: "",
      experince: "",
      attitude: "",
      stability: "",
      technical_skills: "",
      appearance_personality: "",
      skills: "",
    },
  });

  const [assessmentSections, setAssessmentSections] = useState({
    1: { accessment_by: "", weight_age: "", score: "" },
    2: { accessment_by: "", weight_age: "", score: "" },
    3: { accessment_by: "", weight_age: "", score: "" },
    4: { accessment_by: "", weight_age: "", score: "" },
  });

  // Static data
  const [departments] = useState([
    { id: "1", name: "IT" },
    { id: "2", name: "HR" },
    // Add other departments
  ]);

  const [months] = useState([
    { id: 1, name: "Jan." },
    { id: 2, name: "Feb." },
    // Add all months
  ]);

  const [languageOptions] = useState([
    { id: 1, name: "English" },
    { id: 2, name: "Hindi" },
    { id: 3, name: "Punjabi" },
  ]);

  const [relationshipOptions] = useState([
    { id: "1", name: "Father" },
    { id: "2", name: "Mother" },
    // Add other relationships
  ]);

  const [statusOptions] = useState([
    { id: "1", name: "Selected" },
    { id: "2", name: "Rejected" },
    // Add other statuses
  ]);

  const [questions] = useState([
    { id: 1, question: "Have you ever been convicted of a crime?" },
    // Add other questions
  ]);

  // Fetch candidate data
  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/candidates/${candidate_id}`,
          { withCredentials: true }
        );

        console.log(response);
        const data = response.data.candidate;

        // Set main form data
        setFormData({
          ...formData,
          ...data,
          skill_name:
            data.skills_section?.map((skill) => skill.skill_name) || [],
        });

        // Set dynamic sections
        if (data.educations) setEducations(data.educations);
        if (data.languages) setLanguages(data.languages);
        if (data.employments) setEmployments(data.employments);
        if (data.families) setFamilies(data.families);
        if (data.other_informations)
          setOtherInformations(data.other_informations);

        // Process assessments
        if (data.assessments) {
          const assessmentData = {};
          data.assessments.forEach((assessment) => {
            assessmentData[assessment.interviewer] = assessment;
          });
          setAssessments(assessmentData);
        }

        // Process assessment sections
        if (data.assessment_section) {
          const sectionData = {};
          data.assessment_section.forEach((section) => {
            sectionData[section.accessment_type] = section;
          });
          setAssessmentSections(sectionData);
        }
      } catch (error) {
        console.error("Error fetching candidate:", error);
      }
    };

    fetchCandidate();
  }, [candidate_id]);

  console.log(educations)

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Tags input handlers
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (["Enter", "Tab", ","].includes(e.key)) {
      e.preventDefault();
      const value = tagInput.trim();
      if (value && !formData.skill_name.includes(value)) {
        setFormData({
          ...formData,
          skill_name: [...formData.skill_name, value],
        });
        setTagInput("");
      }
    }
  };

  const removeTag = (index) => {
    setFormData({
      ...formData,
      skill_name: formData.skill_name.filter((_, i) => i !== index),
    });
  };

  // Education section handlers
  const addEducation = () => {
    setEducations([
      ...educations,
      { institute_name: "", from: "", to: "", professional_qualification: "" },
    ]);
  };

  const removeEducation = (index) => {
    if (educations.length <= 1) return;
    const updated = [...educations];
    updated.splice(index, 1);
    setEducations(updated);
  };

  const handleEducationChange = (index, field, value) => {
    const updated = [...educations];
    updated[index][field] = value;
    setEducations(updated);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare the data for submission
      const submitData = new FormData();

      // Add basic form data
      Object.keys(formData).forEach((key) => {
        if (key === "skill_name") {
          // Convert skills array to comma-separated string for backend
          submitData.append(key, formData[key].join(","));
        } else if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });

      // Add education data
      if (educations.length > 0) {
        educations.forEach((edu, index) => {
          submitData.append(
            `candidate_education[institute_name][${index}]`,
            edu.institute_name || ""
          );
          submitData.append(
            `candidate_education[from][${index}]`,
            edu.from || ""
          );
          submitData.append(`candidate_education[to][${index}]`, edu.to || "");
          submitData.append(
            `candidate_education[professional_qualification][${index}]`,
            edu.professional_qualification || ""
          );
        });
      }

      // Add language data
      if (languages.length > 0) {
        languages.forEach((lang, index) => {
          const langIndex = index + 1; // Languages seem to start from index 1
          submitData.append(
            `candidate_languages[english_id][${langIndex}]`,
            lang.language_id || ""
          );
          submitData.append(
            `candidate_languages[speak][${langIndex}]`,
            lang.speak || "1"
          );
          submitData.append(
            `candidate_languages[write][${langIndex}]`,
            lang.write || "1"
          );
          submitData.append(
            `candidate_languages[understand][${langIndex}]`,
            lang.understand || "1"
          );
        });
      }

      // Add employment data
      if (employments.length > 0) {
        employments.forEach((emp, index) => {
          submitData.append(
            `candidate_employments[company_name][${index}]`,
            emp.company_name || ""
          );
          submitData.append(
            `candidate_employments[address][${index}]`,
            emp.address || ""
          );
          submitData.append(
            `candidate_employments[contact_details][${index}]`,
            emp.contact_details || ""
          );
          submitData.append(
            `candidate_employments[date_from][${index}]`,
            emp.date_from || ""
          );
          submitData.append(
            `candidate_employments[date_to][${index}]`,
            emp.date_to || ""
          );
          submitData.append(
            `candidate_employments[position][${index}]`,
            emp.position || ""
          );
          submitData.append(
            `candidate_employments[reason_of_leaving][${index}]`,
            emp.reason_of_leaving || ""
          );
        });
      }

      // Add family data
      if (families.length > 0) {
        families.forEach((fam, index) => {
          submitData.append(
            `candidate_families[name][${index}]`,
            fam.name || ""
          );
          submitData.append(
            `candidate_families[relationship][${index}]`,
            fam.relationship || ""
          );
          submitData.append(`candidate_families[age][${index}]`, fam.age || "");
          submitData.append(
            `candidate_families[occupation][${index}]`,
            fam.occupation || ""
          );
          submitData.append(
            `candidate_families[name_of_employer][${index}]`,
            fam.name_of_employer || ""
          );
        });
      }

      // Add other information data
      if (otherInformations.length > 0) {
        otherInformations.forEach((info, index) => {
          const infoIndex = index + 1; // Other info seems to start from index 1
          submitData.append(
            `candidate_other_informations[question_id][${infoIndex}]`,
            info.question_id || ""
          );
          submitData.append(
            `candidate_other_informations[status][${infoIndex}]`,
            info.status || ""
          );
          submitData.append(
            `candidate_other_informations[reason][${infoIndex}]`,
            info.reason || ""
          );
        });
      }

      // Add assessment data
      Object.keys(assessments).forEach((interviewer) => {
        const assessment = assessments[interviewer];
        submitData.append(
          `candidate_assessments[${interviewer}][interviewer_name]`,
          assessment.interviewer_name || ""
        );
        submitData.append(
          `candidate_assessments[${interviewer}][education]`,
          assessment.education || ""
        );
        submitData.append(
          `candidate_assessments[${interviewer}][experince]`,
          assessment.experince || ""
        );
        submitData.append(
          `candidate_assessments[${interviewer}][attitude]`,
          assessment.attitude || ""
        );
        submitData.append(
          `candidate_assessments[${interviewer}][stability]`,
          assessment.stability || ""
        );
        submitData.append(
          `candidate_assessments[${interviewer}][technical_skills]`,
          assessment.technical_skills || ""
        );
        submitData.append(
          `candidate_assessments[${interviewer}][appearance_personality]`,
          assessment.appearance_personality || ""
        );
        submitData.append(
          `candidate_assessments[${interviewer}][skills]`,
          assessment.skills || ""
        );
      });

      // Add assessment section data
      Object.keys(assessmentSections).forEach((sectionType) => {
        const section = assessmentSections[sectionType];
        submitData.append(
          `candidate_assessment_sections[${sectionType}][accessment_by]`,
          section.accessment_by || ""
        );
        submitData.append(
          `candidate_assessment_sections[${sectionType}][weight_age]`,
          section.weight_age || ""
        );
        submitData.append(
          `candidate_assessment_sections[${sectionType}][score]`,
          section.score || ""
        );
      });

      // Handle file upload if present
      const fileInput = document.querySelector('input[name="upload_cv"]');
      if (fileInput && fileInput.files[0]) {
        submitData.append("upload_cv", fileInput.files[0]);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/candidates/update`,
        submitData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === 200) {
        alert("Candidate updated successfully");
        // navigate('/candidates');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error updating candidate:", error);
      alert("Error updating candidate");
    }
  };

  return (
    <>
      {/* Job Particulars */}
      <div className="card">
        <div className="card-header">Job Particulars</div>
        <div className="card-body">
          <div className="form-group row">
            <label htmlFor="position" className="col-2 col-form-label">
              Position Applied For<span className="req">*</span>
            </label>
            <div className="col-10">
              <input
                className="form-control"
                type="text"
                value=""
                // value={formData.position}
                // onChange={handleInputChange}
                name="position"
                id="position"
                required
              />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="department" className="col-2 col-form-label">
              Department<span className="req">*</span>
            </label>
            <div className="col-10">
              <select
                className="form-control"
                name="department"
                value=""
                // value={formData.department}
                // onChange={handleInputChange}
                required
              >
                <option value="">Select..</option>
                {/* {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))} */}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Particulars */}

      <div className="card">
        <div className="card-header">Personal Particulars</div>
        <div className="card-body">
          <div className="form-group row">
            <label for="full_name" className="col-2 col-form-label">
              Full Name<span className="req">*</span>
            </label>
            <div className="col-10">
              <input
                className="form-control"
                type="text"
                value=""
                name="full_name"
                id="full_name"
                maxlength="25"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <div className="form-group row">
                <label for="mobile_number" className="col-4 col-form-label">
                  Mobile Number<span className="req">*</span>
                </label>
                <div className="col-8">
                  <input
                    className="form-control"
                    type="number"
                    value=""
                    min="1"
                    name="mobile_number"
                    id="mobile_number"
                  />
                </div>
              </div>
              <div className="form-group row">
                <label for="Country" className="col-4 col-form-label">
                  Country
                </label>
                <div className="col-8">
                  <select
                    className="form-control input-border"
                    name="country"
                    id="country-dropdown"
                  >
                    <option value="">--Select Country--</option>

                    <option value="1">1</option>
                  </select>
                </div>
              </div>
              <div className="form-group row">
                <label for="Country" className="col-4 col-form-label">
                  City
                </label>
                <div className="col-8">
                  <select
                    className="form-control input-border"
                    name="city"
                    id="city-dropdown"
                  >
                    <option></option>
                  </select>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-4 col-form-label">
                  Gender<span className="req">*</span>
                </label>
                <div className="col-8">
                  <div className="form-check form-check-inline">
                    <label className="form-check-label">
                      {" "}
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        id="gender1"
                        value="1"
                      />{" "}
                      Male
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <label className="form-check-label">
                      {" "}
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        id="gender2"
                        value="2"
                      />{" "}
                      Female
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <label for="passport_number" className="col-4 col-form-label">
                  Passport Number
                </label>
                <div className="col-8">
                  <input
                    className="form-control"
                    type="text"
                    value=""
                    name="passport_number"
                    id="passport_number"
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="form-group row">
                <label for="residence_address" className="col-4 col-form-label">
                  Address<span className="req">*</span>
                </label>
                <div className="col-8">
                  <input
                    className="form-control"
                    rows="3"
                    id="residence_address"
                    value=""
                    name="residence_address"
                  />
                </div>
              </div>
              <div className="form-group row">
                <label for="state" className="col-4 col-form-label">
                  State
                </label>
                <div className="col-8">
                  <select
                    className="form-control input-border"
                    name="state"
                    id="state-dropdown"
                  >
                    <option></option>
                  </select>
                </div>
              </div>

              <div className="form-group row">
                <label for="nationality" className="col-4 col-form-label">
                  Nationality<span className="req">*</span>
                </label>
                <div className="col-8">
                  <input
                    className="form-control"
                    type="text"
                    value=""
                    id="nationality"
                    name="nationality"
                  />
                </div>
              </div>
              <div className="form-group row">
                <label for="place_of_birth" className="col-4 col-form-label">
                  Place of Birth<span className="req">*</span>
                </label>
                <div className="col-8">
                  <input
                    className="form-control"
                    type="text"
                    value=""
                    id="place_of_birth"
                    name="place_of_birth"
                  />
                </div>
              </div>

              <div className="form-group row">
                <label for="email" className="col-4 col-form-label">
                  Email Address<span className="req">*</span>
                </label>
                <div className="col-8"></div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-6">
                <div className="form-group row">
                  <label for="dob" className="col-4 col-form-label">
                    Date of Birth<span className="req">*</span>
                  </label>
                  <div className="col-8">
                    <input
                      className="form-control"
                      type="text"
                      value=""
                      id="dob"
                      name="dob"
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group row">
                  <label for="age" className="col-4 col-form-label">
                    Age<span className="req">*</span>
                  </label>
                  <div className="col-8">
                    <input
                      className="form-control"
                      type="text"
                      value=""
                      id="age"
                      name="age"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group row">
              <label for="hobbies" className="col-2 col-form-label">
                Hobbies
              </label>
              <div className="col-4">
                <textarea
                  className="form-control"
                  rows="2"
                  id="hobbies"
                  name="hobbies"
                ></textarea>
              </div>
              <label for="marital_status" className="col-2 col-form-label">
                Marital Status<span className="req">*</span>
              </label>
              <div className="col-3">
                <div className="form-check form-check-inline">
                  <label className="form-check-label">
                    {" "}
                    <input
                      className="form-check-input"
                      type="radio"
                      name="marital_status"
                      id="marital_status1"
                      value="1"
                    />
                    Single
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <label className="form-check-label">
                    {" "}
                    <input
                      className="form-check-input"
                      type="radio"
                      name="marital_status"
                      id="marital_status2"
                      value="2"
                    />{" "}
                    Married
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Education Details */}
      <div className="card">
        <div className="card-header">
          Education Details<span className="req">*</span>
          <a
            className="btn btn-primary btn-sm float-right add-education"
            data-added="0"
          >
            <i className="fas fa-plus"></i> Add Row
          </a>
        </div>
        <div className="card-body">
          <table className="table table-bordered " id="wgz_edu_details">
            <thead>
              <tr>
                <th width="2%">S No.</th>
                <th>
                  School / University / Professional Institute (Latest First)
                </th>
                <th width="10%">From</th>
                <th width="10%">To</th>
                <th>
                  Highest Standard Passed / Certificate / Degree / Professional
                  Qualifications
                </th>
                <th width="5%">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr id="rec-{{$ek}}">
                <td>
                  <span className="sn"></span>
                </td>
                <td>
                  <textarea
                    className="form-control"
                    rows="2"
                    name="candidate_education[institute_name][]"
                  ></textarea>
                </td>
                <td>
                  <select
                    className="custom-select"
                    name="candidate_education[from][]"
                  >
                    <option value="">From...</option>

                    <option value="{{$j}}"></option>
                  </select>
                </td>
                <td>
                  <select
                    className="custom-select"
                    name="candidate_education[to][]"
                  >
                    <option value="">To...</option>

                    <option value="{{$j}}"></option>
                  </select>
                </td>
                <td>
                  <textarea
                    className="form-control"
                    rows="2"
                    name="candidate_education[professional_qualification][]"
                  ></textarea>
                </td>
                <td>
                  <a
                    className="btn btn-xs delete-record"
                    style={{ display: "none" }}
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
                  <textarea
                    className="form-control"
                    rows="2"
                    name="candidate_education[institute_name][]"
                  ></textarea>
                </td>
                <td>
                  <select
                    className="custom-select education_from"
                    name="candidate_education[from][]"
                  >
                    <option value="">From...</option>

                    <option value="{{$j}}"></option>
                  </select>
                </td>
                <td>
                  <select
                    className="custom-select education_to"
                    name="candidate_education[to][]"
                  >
                    <option value="">To...</option>

                    <option value="{{$j}}"></option>
                  </select>
                </td>
                <td>
                  <textarea
                    className="form-control"
                    rows="2"
                    name="candidate_education[professional_qualification][]"
                  ></textarea>
                </td>

                <td>
                  <a
                    className="btn btn-xs delete-record"
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

      {/* Language Proficiency */}
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
                    <option value="1"></option>
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

      {/* Technical Skills */}

      <div className="card">
        <div className="card-header">
          Technical Skills<span className="req">*</span>
        </div>
        <div className="card-body">
          <div className="form-group row">
            <div className="col-12">
              <input
                className="form-control"
                type="text"
                name="skill_name"
                value=""
                id="wgz_skills"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Employment History */}

      <div className="card">
        <div className="card-header">
          Employment History <span className="req">*</span>
          <a
            className="btn btn-primary btn-sm float-right add-employment"
            data-added="0"
          >
            <i className="fas fa-plus"></i> Add Row
          </a>
        </div>
        <div className="card-body">
          <table className="table table-bordered " id="wgz_employment">
            <thead>
              <tr>
                <th>S No.</th>
                <th>Name of the Company / Address / Contact Details</th>
                <th>From</th>
                <th>To</th>
                <th>Position Held</th>
                <th>Reason for Leaving</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr id="rec-employment-{{$em}}">
                <td>
                  <span className="sn"></span>
                </td>
                <td>
                  Name of the Company{" "}
                  <textarea
                    className="form-control"
                    name="candidate_employments[company_name][]"
                  ></textarea>
                  Address{" "}
                  <textarea
                    className="form-control"
                    name="candidate_employments[address][]"
                  ></textarea>
                  Contact Details{" "}
                  <textarea
                    className="form-control"
                    name="candidate_employments[contact_details][]"
                  ></textarea>
                </td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    value=""
                    name="candidate_employments[date_from][]"
                    autocomplete="nope"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    value=""
                    name="candidate_employments[date_to][]"
                    autocomplete="nope"
                  />
                </td>
                <td>
                  <textarea
                    className="form-control"
                    name="candidate_employments[position][]"
                    rows="6"
                  ></textarea>
                </td>
                <td>
                  <textarea
                    className="form-control"
                    name="candidate_employments[reason_of_leaving][]"
                    rows="6"
                  ></textarea>
                </td>
                <td>
                  <a
                    className="btn btn-xs delete-record-employment"
                    data-id="{{$em}}"
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
                  Name of the Company{" "}
                  <textarea
                    className="form-control"
                    name="candidate_employments[company_name][]"
                  ></textarea>
                  Address{" "}
                  <textarea
                    className="form-control"
                    name="candidate_employments[address][]"
                  ></textarea>{" "}
                  Contact Details{" "}
                  <textarea
                    className="form-control"
                    name="candidate_employments[contact_details][]"
                  ></textarea>
                </td>
                <td>
                  <select
                    className="custom-select "
                    name="candidate_employments[date_from][]"
                  >
                    <option value="">From...</option>

                    <option value=""></option>
                  </select>
                </td>
                <td>
                  <select
                    className="custom-select"
                    name="candidate_employments[date_to][]"
                  >
                    <option value="">To...</option>

                    <option value=""></option>
                  </select>
                </td>
                <td>
                  <textarea
                    className="form-control"
                    name="candidate_employments[position][]"
                    rows="6"
                  ></textarea>
                </td>
                <td>
                  <select
                    className="custom-select"
                    name="candidate_employments[reason_of_leaving][]"
                  >
                    <option value="">Select Reason</option>
                    <option value="Growth Prospects">Growth Prospects</option>
                    <option value="Medical Issue">Medical Issue</option>
                    <option value="Family Issue">Family Issue</option>
                    <option value="Salary Issue">Salary Issue</option>
                    <option value="Employee Benefits">Employee Benefits</option>
                    <option value="Other">Other</option>
                  </select>
                </td>
                <td>
                  <a
                    className="btn btn-xs delete-record-employment"
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

      {/* Family Details */}
      <div className="card">
        <div className="card-header">
          FAMILY DETAILS<span className="req">*</span>{" "}
          <a
            className="btn btn-primary btn-sm float-right add-family"
            data-added="0"
          >
            <i className="fas fa-plus"></i> Add Row
          </a>
        </div>
        <div className="card-body">
          <table className="table table-bordered " id="wgz_family">
            <thead>
              <tr>
                <th width="2%">S No.</th>
                <th width="10%">NAME</th>
                <th width="10%">RELATIONSHIP</th>
                <th width="5%">AGE</th>
                <th width="10%">OCCUPATION</th>
                <th width="10%">NAME OF EMPLOYER</th>
                <th width="5%">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr id="rec-family-{{$fa}}">
                <td>
                  <span className="sn"></span>
                </td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    value=""
                    name="candidate_families[name][]"
                  />
                </td>
                <td>
                  <select
                    className="custom-select"
                    name="candidate_families[relationship][]"
                  >
                    <option value="">Relationship</option>
                    <option value=""></option> @endforeach
                  </select>
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    name="candidate_families[age][]"
                    min="0"
                    step="1"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    name="candidate_families[occupation][]"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    value=""
                    name="candidate_families[name_of_employer][]"
                  />
                </td>
                <td>
                  <a className="btn btn-xs delete-record-family" data-id="">
                    <i className="fas fa-trash"></i>
                  </a>
                </td>
              </tr>

              <tr>
                <td>
                  <span className="sn">1</span>
                </td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    value=""
                    name="candidate_families[name][]"
                  />
                </td>
                <td>
                  <select
                    className="custom-select"
                    name="candidate_families[relationship][]"
                  >
                    <option value="">Relationship</option>

                    <option value=""></option>
                  </select>
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    name="candidate_families[age][]"
                    min="0"
                    step="1"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="search"
                    name="candidate_families[occupation][]"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="search"
                    name="candidate_families[name_of_employer][]"
                  />
                </td>
                <td>
                  <a
                    className="btn btn-xs delete-record-family"
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

      {/* Other information */}
      <div className="card">
        <div className="card-header">
          Other Information<span className="req">*</span>
        </div>
        <div className="card-body">
          <table className="table table-bordered ">
            <thead>
              <tr>
                <th width="40%">DETAILS</th>
                <th width="10%">&nbsp;</th>
                <th>IF YES, PLEASE ELABORATE:</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {" "}
                  <input
                    type="hidden"
                    name="candidate_other_informations[question_id][{{$question->id}}]"
                    value="{{$question->id}}"
                  />
                </td>
                <td>
                  <div className="form-check form-check-inline">
                    <label className="form-check-label">
                      {" "}
                      <input
                        className="form-check-input"
                        type="radio"
                        name="candidate_other_informations[status][{{$question->id}}]"
                        value="1"
                      />{" "}
                      Yes
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <label className="form-check-label">
                      {" "}
                      <input
                        className="form-check-input"
                        type="radio"
                        name="candidate_other_informations[status][{{$question->id}}]"
                        value="0"
                      />{" "}
                      No
                    </label>
                  </div>
                </td>
                <td>
                  <textarea
                    className="form-control"
                    rows="2"
                    name="candidate_other_informations[reason][{{$question->id}}]"
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* for official use only */}
      <div className="card">
        <div className="card-header">For offical use only</div>
        <div className="card-body">
          <table className="table table-bordered " id="wgz_assessments">
            <thead>
              <tr>
                <th>
                  Interviewer's Assessment:
                  <br />
                  (Tick as appropriate) Out of max 5
                </th>
                <th>
                  Interviewer 1 – TL <br />
                  (out of 5)
                </th>
                <th>
                  Interviewer 2 – PM <br />
                  (out of 5)
                </th>
                <th>
                  Interviewer 3 – HR <br />
                  (out of 5)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Interviewer Name</td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    value=""
                    name="candidate_assessments[1][interviewer_name]"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    value=""
                    name="candidate_assessments[2][interviewer_name]"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    value=""
                    name="candidate_assessments[3][interviewer_name]"
                  />
                </td>
              </tr>
              <tr>
                <td>Education</td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    max="5"
                    step=".5"
                    value=""
                    name="candidate_assessments[1][education]"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    max="5"
                    step=".5"
                    value=""
                    name="candidate_assessments[2][education]"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    max="5"
                    step=".5"
                    value=""
                    name="candidate_assessments[3][education]"
                  />
                </td>
              </tr>
              <tr>
                <td>Experience</td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    max="5"
                    step=".5"
                    value=""
                    name="candidate_assessments[1][experince]"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    max="5"
                    step=".5"
                    value=""
                    name="candidate_assessments[2][experince]"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    max="5"
                    step=".5"
                    value=""
                    name="candidate_assessments[3][experince]"
                  />
                </td>
              </tr>
              <tr>
                <td>Attitude</td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    max="5"
                    step=".5"
                    value=""
                    name="candidate_assessments[1][attitude]"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    max="5"
                    step=".5"
                    value=""
                    name="candidate_assessments[2][attitude]"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    max="5"
                    step=".5"
                    value=""
                    name="candidate_assessments[3][attitude]"
                  />
                </td>
              </tr>
              <tr>
                <td>Stability</td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    max="5"
                    step=".5"
                    value=""
                    name="candidate_assessments[1][stability]"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    max="5"
                    step=".5"
                    value=""
                    name="candidate_assessments[2][stability]"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    max="5"
                    step=".5"
                    value=""
                    name="candidate_assessments[3][stability]"
                  />
                </td>
              </tr>
              <tr>
                <td>Technical Skills</td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    max="5"
                    step=".5"
                    value=""
                    name="candidate_assessments[1][technical_skills]"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    max="5"
                    step=".5"
                    value=""
                    name="candidate_assessments[2][technical_skills]"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    max="5"
                    step=".5"
                    value=""
                    name="candidate_assessments[3][technical_skills]"
                  />
                </td>
              </tr>
              <tr>
                <td>Appearance/ Personality</td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    max="5"
                    step=".5"
                    value=""
                    name="candidate_assessments[1][appearance_personality]"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    max="5"
                    step=".5"
                    value=""
                    name="candidate_assessments[2][appearance_personality]"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    max="5"
                    step=".5"
                    value=""
                    name="candidate_assessments[3][appearance_personality]"
                  />
                </td>
              </tr>
              <tr>
                <td>Communication / Written Skills</td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    max="5"
                    step=".5"
                    value=""
                    name="candidate_assessments[1][skills]"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    max="5"
                    step=".5"
                    value=""
                    name="candidate_assessments[2][skills]"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    max="5"
                    step=".5"
                    value=""
                    name="candidate_assessments[3][skills]"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Assessment Section */}
					<div className="card">
						<div className="card-header">Assessment Section</div>
						<div className="card-body">
							<table className="table table-bordered " id="wgz_assessments">
								<thead>
									<tr>
										<th>&nbsp;</th>
										<th>Assessment By</th>
										<th>Weight age</th>
										<th>Score (out of 10)</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>Aptitude Test Score</td>
										<td><input className="form-control" type="text"
											value=""
											name="candidate_assessment_sections[1][accessment_by]"/></td>
										<td><select className="custom-select"
											name="candidate_assessment_sections[1][weight_age]">
												<option value="">Choose...</option>
												<option value="1"
													>Below
													Average</option>
												<option value="2"
													>Average</option>
												<option value="3"
													>Above
													Average</option>
										</select></td>
										<td><input className="form-control" type="number" min="0" max="10"
											step=".5"
											value=""
											name="candidate_assessment_sections[1][score]"/></td>
									</tr>
									<tr>
										<td>Technical Test (Theoretical)</td>
										<td><input className="form-control" type="text"
											value=""
											name="candidate_assessment_sections[2][accessment_by]"/></td>
										<td><select className="custom-select"
											name="candidate_assessment_sections[2][weight_age]">
												<option value="">Choose...</option>
												<option value="1"
													>Below
													Average</option>
												<option value="2"
												>Average</option>
												<option value="3"
													>Above
													Average</option>
										</select></td>
										<td><input className="form-control" type="number" min="0" max="10"
											step=".5"
											value=""
											name="candidate_assessment_sections[2][score]"/></td>
									</tr>
									<tr>
										<td>Technical Test (Practical)</td>
										<td><input className="form-control" type="text"
											value=""
											name="candidate_assessment_sections[3][accessment_by]"/></td>
										<td><select className="custom-select"
											name="candidate_assessment_sections[3][weight_age]">
												<option value="">Choose...</option>
												<option value="1"
													>Below
													Average</option>
												<option value="2"
													>Average</option>
												<option value="3"
													>Above
													Average</option>
										</select></td>
										<td><input className="form-control" type="number" min="0" max="10"
											step=".5"
											value=""
											name="candidate_assessment_sections[3][score]"/></td>
									</tr>
									<tr>
										<td>HR Round</td>
										<td><input className="form-control" type="text"
											value=""
											name="candidate_assessment_sections[4][accessment_by]"/></td>
										<td><select className="custom-select"
											name="candidate_assessment_sections[4][weight_age]">
												<option value="">Choose...</option>
												<option value="1"
												>Below
													Average</option>
												<option value="2"
													>Average</option>
												<option value="3"
													>Above
													Average</option>
										</select></td>
										<td><input className="form-control" type="number" min="0" max="10"
											step=".5"
											value=""
											name="candidate_assessment_sections[4][score]"/></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

          {/* Head of department */}

          	<div className="card">
						<div className="card-header">Head of department's recommendation</div>
						<div className="card-body">
							<div className="form-group row">
								<label for="status" className="col-2 col-form-label">Status<span
									className="req">*</span></label>
								<div className="col-10">
									<select className="custom-select" id="status" name="status">
										<option value="">Choose...</option> 
									
										<option value="1" ></option>
									
									</select>
								</div>
							</div>

							<div className="form-group row">
								<label for="status" className="col-2 col-form-label">Remarks</label>
								<div className="col-10">
									<textarea id="remarks" className="form-control" name="remarks"
										rows="5"></textarea>
								</div>
							</div>

							<div className="row">
								<div className="col-lg-4">
									<div className="form-group row">
										<label for="sourcing" className="col-4 col-form-label">Sourcing</label>
										<div className="col-8">
											<input className="form-control" type="text"
												value="" id="sourcing"
												name="sourcing"/>
										</div>
									</div>
								</div>
								<div className="col-lg-4">
									<div className="form-group row">
										<label for="date_of_interview" className="col-4 col-form-label">Date
											of Interview</label>
										<div className="col-8">
											<input className="form-control" type="date"
												value=""
												id="date_of_interview" name="date_of_interview"/>
										</div>
									</div>
								</div>
								<div className="col-lg-4">
									<div className="form-group row">
										<label for="interviewed_by" className="col-4 col-form-label">Interviewed
											By</label>
										<div className="col-8">
											<input className="form-control" type="text"
												value="" id="interviewed_by"
												name="interviewed_by"/>
										</div>
									</div>
								</div>
							</div>


							<div className="row">
								<div className="col-lg-4">
									<div className="form-group row">
										<label for="interview_score" className="col-4 col-form-label">Interview
											Score</label>
										<div className="col-8">
											<input className="form-control" type="number" min="0"
												value="" id="interview_score"
												name="interview_score"/>
										</div>
									</div>
								</div>
								<div className="col-lg-4">
									<div className="form-group row">
										<label for="current_salary" className="col-4 col-form-label">Current
											Salary</label>
										<div className="col-8">
											<input className="form-control" type="text"
												value="" id="current_salary"
												name="current_salary"/>
										</div>
									</div>
								</div>
								<div className="col-lg-4">
									<div className="form-group row">
										<label for="expected_salary" className="col-4 col-form-label">Expected
											Salary</label>
										<div className="col-8">
											<input className="form-control" type="text"
												value="" id="expected_salary"
												name="expected_salary"/>
										</div>
									</div>
								</div>
								<div className="col-lg-12">
									<input className="btn btn-success float-right wgz-submit"
										type="submit" name="submit"/>

								</div>
							</div>
						</div>
					</div>
    </>
  );
};

export default CandidateEditForm;
