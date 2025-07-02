import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CandidateEditForm = () => {
  const { candidate_id } = useParams();
  const navigate = useNavigate();
  
  // State for form data
  const [formData, setFormData] = useState({
    candidate_id: candidate_id,
    position: '',
    department: '',
    full_name: '',
    mobile_number: '',
    email: '',
    gender: '1',
    passport_number: '',
    residence_address: '',
    marital_status: '1',
    nationality: '',
    dob: '',
    age: '',
    place_of_birth: '',
    hobbies: '',
    status: '',
    remarks: '',
    date_of_interview: '',
    interview_score: '',
    interviewed_by: '',
    sourcing: '',
    current_salary: '',
    expected_salary: '',
    offered_salary: '',
    skill_name: [],
  });

  // State for tags input
  const [tagInput, setTagInput] = useState('');

  // State for dynamic sections
  const [educations, setEducations] = useState([{
    institute_name: '',
    from: '',
    to: '',
    professional_qualification: ''
  }]);

  const [languages, setLanguages] = useState([{
    language_id: '',
    speak: '1',
    write: '1',
    understand: '1'
  }]);

  const [employments, setEmployments] = useState([{
    company_name: '',
    address: '',
    contact_details: '',
    date_from: '',
    date_to: '',
    position: '',
    reason_of_leaving: ''
  }]);

  const [families, setFamilies] = useState([{
    name: '',
    relationship: '',
    age: '',
    occupation: '',
    name_of_employer: ''
  }]);

  const [otherInformations, setOtherInformations] = useState([]);
  const [assessments, setAssessments] = useState({
    1: { interviewer_name: '', education: '', experince: '', attitude: '', stability: '', technical_skills: '', appearance_personality: '', skills: '' },
    2: { interviewer_name: '', education: '', experince: '', attitude: '', stability: '', technical_skills: '', appearance_personality: '', skills: '' },
    3: { interviewer_name: '', education: '', experince: '', attitude: '', stability: '', technical_skills: '', appearance_personality: '', skills: '' }
  });

  const [assessmentSections, setAssessmentSections] = useState({
    1: { accessment_by: '', weight_age: '', score: '' },
    2: { accessment_by: '', weight_age: '', score: '' },
    3: { accessment_by: '', weight_age: '', score: '' },
    4: { accessment_by: '', weight_age: '', score: '' }
  });

  // Static data
  const [departments] = useState([
    { id: '1', name: 'IT' },
    { id: '2', name: 'HR' },
    // Add other departments
  ]);

  const [months] = useState([
    { id: 1, name: 'Jan.' },
    { id: 2, name: 'Feb.' },
    // Add all months
  ]);

  const [languageOptions] = useState([
    { id: 1, name: 'English' },
    { id: 2, name: 'Hindi' },
    { id: 3, name: 'Punjabi' }
  ]);

  const [relationshipOptions] = useState([
    { id: '1', name: 'Father' },
    { id: '2', name: 'Mother' },
    // Add other relationships
  ]);

  const [statusOptions] = useState([
    { id: '1', name: 'Selected' },
    { id: '2', name: 'Rejected' },
    // Add other statuses
  ]);

  const [questions] = useState([
    { id: 1, question: 'Have you ever been convicted of a crime?' },
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
          skill_name: data.skills_section?.map(skill => skill.skill_name) || []
        });

        // Set dynamic sections
        if (data.educations) setEducations(data.educations);
        if (data.languages) setLanguages(data.languages);
        if (data.employments) setEmployments(data.employments);
        if (data.families) setFamilies(data.families);
        if (data.other_informations) setOtherInformations(data.other_informations);
        
        // Process assessments
        if (data.assessments) {
          const assessmentData = {};
          data.assessments.forEach(assessment => {
            assessmentData[assessment.interviewer] = assessment;
          });
          setAssessments(assessmentData);
        }
        
        // Process assessment sections
        if (data.assessment_section) {
          const sectionData = {};
          data.assessment_section.forEach(section => {
            sectionData[section.accessment_type] = section;
          });
          setAssessmentSections(sectionData);
        }
      } catch (error) {
        console.error('Error fetching candidate:', error);
      }
    };

    fetchCandidate();
  }, [candidate_id]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Tags input handlers
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (['Enter', 'Tab', ','].includes(e.key)) {
      e.preventDefault();
      const value = tagInput.trim();
      if (value && !formData.skill_name.includes(value)) {
        setFormData({
          ...formData,
          skill_name: [...formData.skill_name, value]
        });
        setTagInput('');
      }
    }
  };

  const removeTag = (index) => {
    setFormData({
      ...formData,
      skill_name: formData.skill_name.filter((_, i) => i !== index)
    });
  };

  // Education section handlers
  const addEducation = () => {
    setEducations([
      ...educations,
      { institute_name: '', from: '', to: '', professional_qualification: '' }
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
    Object.keys(formData).forEach(key => {
      if (key === 'skill_name') {
        // Convert skills array to comma-separated string for backend
        submitData.append(key, formData[key].join(','));
      } else if (formData[key] !== null && formData[key] !== undefined) {
        submitData.append(key, formData[key]);
      }
    });

    // Add education data
    if (educations.length > 0) {
      educations.forEach((edu, index) => {
        submitData.append(`candidate_education[institute_name][${index}]`, edu.institute_name || '');
        submitData.append(`candidate_education[from][${index}]`, edu.from || '');
        submitData.append(`candidate_education[to][${index}]`, edu.to || '');
        submitData.append(`candidate_education[professional_qualification][${index}]`, edu.professional_qualification || '');
      });
    }

    // Add language data
    if (languages.length > 0) {
      languages.forEach((lang, index) => {
        const langIndex = index + 1; // Languages seem to start from index 1
        submitData.append(`candidate_languages[english_id][${langIndex}]`, lang.language_id || '');
        submitData.append(`candidate_languages[speak][${langIndex}]`, lang.speak || '1');
        submitData.append(`candidate_languages[write][${langIndex}]`, lang.write || '1');
        submitData.append(`candidate_languages[understand][${langIndex}]`, lang.understand || '1');
      });
    }

    // Add employment data
    if (employments.length > 0) {
      employments.forEach((emp, index) => {
        submitData.append(`candidate_employments[company_name][${index}]`, emp.company_name || '');
        submitData.append(`candidate_employments[address][${index}]`, emp.address || '');
        submitData.append(`candidate_employments[contact_details][${index}]`, emp.contact_details || '');
        submitData.append(`candidate_employments[date_from][${index}]`, emp.date_from || '');
        submitData.append(`candidate_employments[date_to][${index}]`, emp.date_to || '');
        submitData.append(`candidate_employments[position][${index}]`, emp.position || '');
        submitData.append(`candidate_employments[reason_of_leaving][${index}]`, emp.reason_of_leaving || '');
      });
    }

    // Add family data
    if (families.length > 0) {
      families.forEach((fam, index) => {
        submitData.append(`candidate_families[name][${index}]`, fam.name || '');
        submitData.append(`candidate_families[relationship][${index}]`, fam.relationship || '');
        submitData.append(`candidate_families[age][${index}]`, fam.age || '');
        submitData.append(`candidate_families[occupation][${index}]`, fam.occupation || '');
        submitData.append(`candidate_families[name_of_employer][${index}]`, fam.name_of_employer || '');
      });
    }

    // Add other information data
    if (otherInformations.length > 0) {
      otherInformations.forEach((info, index) => {
        const infoIndex = index + 1; // Other info seems to start from index 1
        submitData.append(`candidate_other_informations[question_id][${infoIndex}]`, info.question_id || '');
        submitData.append(`candidate_other_informations[status][${infoIndex}]`, info.status || '');
        submitData.append(`candidate_other_informations[reason][${infoIndex}]`, info.reason || '');
      });
    }

    // Add assessment data
    Object.keys(assessments).forEach(interviewer => {
      const assessment = assessments[interviewer];
      submitData.append(`candidate_assessments[${interviewer}][interviewer_name]`, assessment.interviewer_name || '');
      submitData.append(`candidate_assessments[${interviewer}][education]`, assessment.education || '');
      submitData.append(`candidate_assessments[${interviewer}][experince]`, assessment.experince || '');
      submitData.append(`candidate_assessments[${interviewer}][attitude]`, assessment.attitude || '');
      submitData.append(`candidate_assessments[${interviewer}][stability]`, assessment.stability || '');
      submitData.append(`candidate_assessments[${interviewer}][technical_skills]`, assessment.technical_skills || '');
      submitData.append(`candidate_assessments[${interviewer}][appearance_personality]`, assessment.appearance_personality || '');
      submitData.append(`candidate_assessments[${interviewer}][skills]`, assessment.skills || '');
    });

    // Add assessment section data
    Object.keys(assessmentSections).forEach(sectionType => {
      const section = assessmentSections[sectionType];
      submitData.append(`candidate_assessment_sections[${sectionType}][accessment_by]`, section.accessment_by || '');
      submitData.append(`candidate_assessment_sections[${sectionType}][weight_age]`, section.weight_age || '');
      submitData.append(`candidate_assessment_sections[${sectionType}][score]`, section.score || '');
    });

    // Handle file upload if present
    const fileInput = document.querySelector('input[name="upload_cv"]');
    if (fileInput && fileInput.files[0]) {
      submitData.append('upload_cv', fileInput.files[0]);
    }

    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/candidates/update`, 
      submitData,
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    );
    
    if (response.data.status === 200) {
      alert('Candidate updated successfully');
      // navigate('/candidates');
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error('Error updating candidate:', error);
    alert('Error updating candidate');
  }
};

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Edit Candidate</h1>
            </div>
          </div>
        </div>
      </section>

      <div className="card">
        <div className="card-body">
          <div className="row mr-1 wgz_candidate_form">
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="candidate_id" value={formData.candidate_id} />
              
              <div className="col-lg-12">
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
                          value={formData.position}
                          onChange={handleInputChange}
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
                          value={formData.department}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select..</option>
                          {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name}
                            </option>
                          ))}
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
                      <label htmlFor="full_name" className="col-2 col-form-label">
                        Full Name<span className="req">*</span>
                      </label>
                      <div className="col-10">
                        <input
                          className="form-control"
                          type="text"
                          value={formData.full_name}
                          onChange={handleInputChange}
                          name="full_name"
                          id="full_name"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="form-group row">
                          <label htmlFor="mobile_number" className="col-4 col-form-label">
                            Mobile Number<span className="req">*</span>
                          </label>
                          <div className="col-8">
                            <input
                              className="form-control"
                              type="text"
                              value={formData.mobile_number}
                              onChange={handleInputChange}
                              name="mobile_number"
                              id="mobile_number"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="form-group row">
                          <label htmlFor="email" className="col-4 col-form-label">
                            Email Address<span className="req">*</span>
                          </label>
                          <div className="col-8">
                            <input
                              className="form-control"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              name="email"
                              id="email"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="form-group row">
                          <label className="col-4 col-form-label">Gender</label>
                          <div className="col-8">
                            <div className="form-check form-check-inline">
                              <label className="form-check-label">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  checked={formData.gender === '1'}
                                  onChange={() => setFormData({...formData, gender: '1'})}
                                  name="gender"
                                  id="gender1"
                                  value="1"
                                /> Male
                              </label>
                            </div>
                            <div className="form-check form-check-inline">
                              <label className="form-check-label">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  checked={formData.gender === '2'}
                                  onChange={() => setFormData({...formData, gender: '2'})}
                                  name="gender"
                                  id="gender2"
                                  value="2"
                                /> Female
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="form-group row">
                          <label htmlFor="passport_number" className="col-4 col-form-label">
                            Passport Number
                          </label>
                          <div className="col-8">
                            <input
                              className="form-control"
                              type="text"
                              value={formData.passport_number}
                              onChange={handleInputChange}
                              name="passport_number"
                              id="passport_number"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-lg-6">
                        <div className="form-group row">
                          <label htmlFor="residence_address" className="col-4 col-form-label">
                            Residence Number & Address
                          </label>
                          <div className="col-8">
                            <textarea
                              className="form-control"
                              rows="3"
                              id="residence_address"
                              name="residence_address"
                              value={formData.residence_address}
                              onChange={handleInputChange}
                            ></textarea>
                          </div>
                        </div>
                        
                        <div className="form-group row">
                          <label htmlFor="marital_status" className="col-4 col-form-label">
                            Marital Status
                          </label>
                          <div className="col-8">
                            <div className="form-check form-check-inline">
                              <label className="form-check-label">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  checked={formData.marital_status === '1'}
                                  onChange={() => setFormData({...formData, marital_status: '1'})}
                                  name="marital_status"
                                  id="marital_status1"
                                  value="1"
                                /> Single
                              </label>
                            </div>
                            <div className="form-check form-check-inline">
                              <label className="form-check-label">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  checked={formData.marital_status === '2'}
                                  onChange={() => setFormData({...formData, marital_status: '2'})}
                                  name="marital_status"
                                  id="marital_status2"
                                  value="2"
                                /> Married
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="form-group row">
                          <label htmlFor="nationality" className="col-4 col-form-label">
                            Nationality
                          </label>
                          <div className="col-8">
                            <input
                              className="form-control"
                              type="text"
                              value={formData.nationality}
                              onChange={handleInputChange}
                              id="nationality"
                              name="nationality"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="form-group row">
                          <label htmlFor="dob" className="col-4 col-form-label">
                            Date of Birth
                          </label>
                          <div className="col-8">
                            <input
                              className="form-control"
                              type="date"
                              value={formData.dob}
                              onChange={handleInputChange}
                              id="dob"
                              name="dob"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-lg-2">
                        <div className="form-group row">
                          <label htmlFor="age" className="col-4 col-form-label">
                            Age
                          </label>
                          <div className="col-8">
                            <input
                              className="form-control"
                              type="text"
                              value={formData.age}
                              onChange={handleInputChange}
                              id="age"
                              name="age"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-lg-4">
                        <div className="form-group row">
                          <label htmlFor="place_of_birth" className="col-4 col-form-label">
                            Place of Birth
                          </label>
                          <div className="col-8">
                            <input
                              className="form-control"
                              type="text"
                              value={formData.place_of_birth}
                              onChange={handleInputChange}
                              id="place_of_birth"
                              name="place_of_birth"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-group row">
                      <label htmlFor="hobbies" className="col-2 col-form-label">
                        Hobbies
                      </label>
                      <div className="col-10">
                        <textarea
                          className="form-control"
                          rows="2"
                          id="hobbies"
                          name="hobbies"
                          value={formData.hobbies}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Education Details */}
                <div className="card">
                  <div className="card-header">
                    Education Details
                    <button
                      type="button"
                      className="btn btn-primary btn-sm float-right add-education"
                      onClick={addEducation}
                    >
                      <i className="fas fa-plus"></i> Add Row
                    </button>
                  </div>
                  <div className="card-body">
                    <table className="table table-bordered" id="wgz_edu_details">
                      <thead>
                        <tr>
                          <th width="2%">S No.</th>
                          <th>School / University / Professional Institute (Latest First)</th>
                          <th width="10%">From</th>
                          <th width="10%">To</th>
                          <th>Highest Standard Passed / Certificate / Degree / Professional Qualifications</th>
                          <th width="5%">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {educations.map((edu, index) => (
                          <tr key={`edu-${index}`}>
                            <td><span className="sn">{index + 1}</span></td>
                            <td>
                              <textarea
                                className="form-control"
                                rows="2"
                                value={edu.institute_name}
                                onChange={(e) => handleEducationChange(index, 'institute_name', e.target.value)}
                              ></textarea>
                            </td>
                            <td>
                              <select
                                className="custom-select"
                                value={edu.from}
                                onChange={(e) => handleEducationChange(index, 'from', e.target.value)}
                              >
                                <option value="">From...</option>
                                {Array.from({length: new Date().getFullYear() - 1980 + 1}, (_, i) => 1980 + i).map(year => (
                                  <option key={year} value={year}>{year}</option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <select
                                className="custom-select"
                                value={edu.to}
                                onChange={(e) => handleEducationChange(index, 'to', e.target.value)}
                              >
                                <option value="">To...</option>
                                {Array.from({length: new Date().getFullYear() - 1980 + 1}, (_, i) => 1980 + i).map(year => (
                                  <option key={year} value={year}>{year}</option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <textarea
                                className="form-control"
                                rows="2"
                                value={edu.professional_qualification}
                                onChange={(e) => handleEducationChange(index, 'professional_qualification', e.target.value)}
                              ></textarea>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-xs delete-record"
                                onClick={() => removeEducation(index)}
                                disabled={educations.length <= 1}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Technical Skills */}
                <div className="card">
                  <div className="card-header">Technical Skills</div>
                  <div className="card-body">
                    <div className="form-group row">
                      <div className="col-12">
                        <div className="tags-input-container">
                          {formData.skill_name.map((tag, index) => (
                            <div key={index} className="tag-item">
                              <span className="tag-text">{tag}</span>
                              <button 
                                type="button" 
                                className="tag-close"
                                onClick={() => removeTag(index)}
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                          <input
                            type="text"
                            className="tags-input-field"
                            value={tagInput}
                            onChange={handleTagInputChange}
                            onKeyDown={handleTagInputKeyDown}
                            placeholder="Type a skill and press enter"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="card">
                  <div className="card-body">
                    <button type="submit" className="btn btn-success float-right wgz-submit">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .tags-input-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          border: 1px solid #ced4da;
          padding: 0.5rem;
          border-radius: 0.25rem;
          min-height: 42px;
        }
        
        .tags-input-container .tag-item {
          background-color: #e9ecef;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          display: flex;
          align-items: center;
        }
        
        .tags-input-container .tag-item .tag-close {
          margin-left: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-size: 1rem;
          line-height: 1;
        }
        
        .tags-input-container .tags-input-field {
          flex: 1;
          border: none;
          outline: none;
          padding: 0.375rem 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default CandidateEditForm;