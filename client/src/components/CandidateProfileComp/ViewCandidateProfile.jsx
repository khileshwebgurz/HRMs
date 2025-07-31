import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ViewCandidateProfile = () => {
  const { profile_token } = useParams();
  const [candidateData, setCandidateData] = useState([]);
  const fetchData = async () => {
    //candidate/profile/{token}/edit
    const res = await axios.get(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/tracker/candidate/profile/${profile_token}/edit`,
      { withCredentials: true }
    );
    setCandidateData(res.data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  console.log("my candiates are >>>", candidateData);
  return (
    <>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Edit Candidate</h1>
            </div>
            <div className="col-sm-6 text-right">
              <p id="countdownTimer"></p>
            </div>
          </div>
        </div>
      </section>


      <div className="card">
	<div className="card-body">
		<div className="row mr-1 wgz_candidate_form">

			<form action="" method="post" id="wgz_candidate_form"
				enctype="multipart/form-data">
				<input type="hidden" name="candidate_token"
					/> 
				<div className="col-lg-12">

					<div className="card">
						<div className="card-header">Personal Particulars</div>
						<div className="card-body">
							<div className="form-group row">
								<label for="full_name" className="col-2 col-form-label">Full Name<span
									className="req">*</span></label>
								<div className="col-10">
									<input className="form-control" type="text"
										name="full_name"
										id="full_name" maxlength="25"/>
								</div>
							</div>
							<div className="row">
								<div className="col-lg-6">
									<div className="form-group row">
										<label for="mobile_number" className="col-4 col-form-label">Mobile
											Number<span className="req">*</span>
										</label>
										<div className="col-8">
											<input className="form-control" type="number"
												 min="1"
												name="mobile_number" id="mobile_number"/>
										</div>
									</div>
									<div className="form-group row">
										<label for="Country" className="col-4 col-form-label">Country
										</label>
										<div className="col-8">
											<select className="form-control input-border" name="country" id="country-dropdown">
                                            <option value="">--Select Country--</option>
                                           
                                            <option value="{{$country->id}}" ></option>
                                          
                                        </select>
										</div>
									</div>
									<div className="form-group row">
										<label for="Country" className="col-4 col-form-label">City
										</label>
										<div className="col-8">
											<select className="form-control input-border" name="city" id="city-dropdown">
											
						                   
						                   <option ></option>
						                   
                                        </select>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-4 col-form-label">Gender<span
									className="req">*</span></label>
										<div className="col-8">
											<div className="form-check form-check-inline">
												<label className="form-check-label"> <input
													className="form-check-input" type="radio"
													
													name="gender" id="gender1" value="1"/> Male
												</label>
											</div>
											<div className="form-check form-check-inline">
												<label className="form-check-label"> <input
												
													className="form-check-input" type="radio" name="gender"
													id="gender2" value="2"/> Female
												</label>
											</div>
										</div>
									</div>
									<div className="form-group row">
										<label for="passport_number" className="col-4 col-form-label">Passport
											Number</label>
										<div className="col-8">
											<input className="form-control" type="text"
												value="{{$candidate->passport_number}}"
												name="passport_number" id="passport_number"/>
										</div>
									</div>
								</div>

								<div className="col-lg-6">
									<div className="form-group row">
										<label for="residence_address" className="col-4 col-form-label">Address<span
									className="req">*</span></label>
										<div className="col-8">
											<input className="form-control" rows="3"
												id="residence_address" value="{{$candidate->residence_address}}" name="residence_address"/>
										</div>
									</div>
									<div className="form-group row">
										<label for="state" className="col-4 col-form-label">State</label>
										<div className="col-8">

											<select className="form-control input-border" name="state" id="state-dropdown">
											
						                    <option ></option>
						                   
                                        </select>
										</div>
									</div>
									
									<div className="form-group row">
										<label for="nationality" className="col-4 col-form-label">Nationality<span
									className="req">*</span></label>
										<div className="col-8">
											<input className="form-control" type="text"
												value="{{$candidate->nationality}}" id="nationality"
												name="nationality"/>
										</div>
									</div>
									<div className="form-group row">
										<label for="place_of_birth" className="col-4 col-form-label">Place
											of Birth<span
									className="req">*</span></label>
										<div className="col-8">
											<input className="form-control" type="text"
												value="{{$candidate->place_of_birth}}" id="place_of_birth"
												name="place_of_birth"/>
										</div>
									</div>

									<div className="form-group row">
										<label for="email" className="col-4 col-form-label">Email Address<span
									className="req">*</span></label>
										<div className="col-8"></div>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-lg-6">
									<div className="form-group row">
										<label for="dob" className="col-4 col-form-label">Date of Birth<span
									className="req">*</span></label>
										<div className="col-8">
											<input className="form-control" type="text"
												value="{{$candidate->dob}}" id="dob" name="dob"/>
										</div>
									</div>
								</div>
								<div className="col-lg-6">
									<div className="form-group row">
										<label for="age" className="col-4 col-form-label">Age<span
									className="req">*</span></label>
										<div className="col-8">
											<input className="form-control" type="text"
												value="{{$candidate->age}}" id="age" name="age"/>
										</div>
									</div>
								</div>
									
							</div>
							<div className="form-group row">
								<label for="hobbies" className="col-2 col-form-label">Hobbies</label>
								<div className="col-4">
									<textarea className="form-control" rows="2" id="hobbies"
										name="hobbies"></textarea>
								</div>
										<label for="marital_status" className="col-2 col-form-label">Marital
											Status<span
									className="req">*</span></label>
										<div className="col-3">
											<div className="form-check form-check-inline">
												<label className="form-check-label"> <input
													className="form-check-input" type="radio"
													
													name="marital_status" id="marital_status1" value="1"/>
													Single
												</label>
											</div>
											<div className="form-check form-check-inline">
												<label className="form-check-label"> <input
													className="form-check-input" type="radio" name="marital_status"
													
													id="marital_status2" value="2"/> Married
												</label>
											</div>
										</div>
									</div>
						</div>
					</div>

					<div className="card">
						<div className="card-header">
							Education Details<span
									className="req">*</span><a
								className="btn btn-primary btn-sm float-right add-education"
								data-added="0"><i className="fas fa-plus"></i> Add Row</a>
						</div>
						<div className="card-body">
							<table className="table table-bordered " id="wgz_edu_details">
								<thead>
									<tr>
										<th width="2%">S No.</th>
										<th>School / University / Professional Institute (Latest
											First)</th>
										<th width="10%">From</th>
										<th width="10%">To</th>
										<th>Highest Standard Passed / Certificate / Degree /
											Professional Qualifications</th>
										<th width="5%">Action</th>
									</tr>
								</thead>
								<tbody>
							
									<tr id="rec-{{$ek}}">
										<td><span className="sn"></span></td>
										<td><textarea className="form-control" rows="2"
												name="candidate_education[institute_name][]"></textarea></td>
										<td><select className="custom-select"
											name="candidate_education[from][]">
												<option value="">From...</option>									
    								
        									    <option value="{{$j}}"></option>
        									  
									</select></td>
										<td><select className="custom-select"
											name="candidate_education[to][]">
												<option value="">To...</option>									
    								
        									    <option value="{{$j}}"></option>
        									 
									</select></td>
										<td><textarea className="form-control" rows="2"
												name="candidate_education[professional_qualification][]"></textarea></td>
										<td><a className="btn btn-xs delete-record" 
											style={{display: "none"}} 
											data-id="<?php echo $ek; ?>"><i className="fas fa-trash"></i></a></td>
									</tr>
								
								    <tr>
										<td><span className="sn">1</span></td>
										<td><textarea className="form-control" rows="2"
												name="candidate_education[institute_name][]"></textarea></td>
										<td><select className="custom-select education_from"
											name="candidate_education[from][]">
												<option value="">From...</option>									
    								
        									    <option value="{{$j}}"></option>
        									   
									</select></td>
										<td><select className="custom-select education_to"
											name="candidate_education[to][]">
												<option value="">To...</option>									
    								
        									    <option value="{{$j}}"></option>
        									   
									</select></td>
										<td><textarea className="form-control" rows="2"
												name="candidate_education[professional_qualification][]"></textarea></td>
										<td><a className="btn btn-xs delete-record" style={{display: "none"}}
											data-id="0"><i className="fas fa-trash"></i></a></td>
									</tr>
								 
								</tbody>
							</table>
						</div>
					</div>

					<div className="card">
						<div className="card-header">
							Language Profeiciency<a
								className="btn btn-primary btn-sm float-right add-language"
								data-added="0"><i className="fas fa-plus"></i> Add Row</a>
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
										<td><span className="sn"></span></td>
										<td><select className="custom-select wgz_english_id"
											name="candidate_languages[english_id][<?php echo $l; ?>]">
												<option value="">Language...</option>
											<option value="{{$langk}}"></option>
                                    												  
										</select></td>
										<td>
											<div className="form-check form-check-inline">
												<label className="form-check-label"> <input
													className="form-check-input wgz_speak" type="radio"
													
													name="candidate_languages[speak][<?php echo $l; ?>]"
													value="1"/> Yes
												</label>
											</div>
											<div className="form-check form-check-inline">
												<label className="form-check-label"> <input
													className="form-check-input wgz_speak" type="radio"
													
													name="candidate_languages[speak][<?php echo $l; ?>]"
													value="0"/> No
												</label>
											</div>
										</td>
										<td>
											<div className="form-check form-check-inline">
												<label className="form-check-label"> <input
													className="form-check-input wgz_write" type="radio"
												
													name="candidate_languages[write][<?php echo $l; ?>]"
													value="1"/> Yes
												</label>
											</div>
											<div className="form-check form-check-inline">
												<label className="form-check-label"> <input
													className="form-check-input wgz_write" type="radio"
													
													name="candidate_languages[write][<?php echo $l; ?>]"
													value="0"/> No
												</label>
											</div>
										</td>
										<td>
											<div className="form-check form-check-inline">
												<label className="form-check-label"> <input
													className="form-check-input wgz_understand" type="radio"
													
													name="candidate_languages[understand][<?php echo $l; ?>]"
													value="1"/> Yes
												</label>
											</div>
											<div className="form-check form-check-inline">
												<label className="form-check-label"> <input
													className="form-check-input wgz_understand" type="radio"
													
													name="candidate_languages[understand][<?php echo $l; ?>]"
													value="0"/> No
												</label>
											</div>
										</td>
										<td><a className="btn btn-xs delete-record-language"
											
											data-id="<?php echo $l; ?>"><i className="fas fa-trash"></i></a></td>
									</tr>
									    
									
									<tr>
										<td><span className="sn">1</span></td>
										<td><select className="custom-select wgz_english_id"
											name="candidate_languages[english_id][1]">
												<option value="">Language...</option>
												<option value="1">English</option>
												<option value="2">Hindi</option>
												<option value="3">Punjabi</option>
										</select></td>
										<td>
											<div className="form-check form-check-inline">
												<label className="form-check-label"> <input
													className="form-check-input wgz_speak" type="radio" checked
													name="candidate_languages[speak][1]" value="1"/> Yes
												</label>
											</div>
											<div className="form-check form-check-inline">
												<label className="form-check-label"> <input
													className="form-check-input wgz_speak" type="radio"
													name="candidate_languages[speak][1]" value="0"/> No
												</label>
											</div>
										</td>
										<td>
											<div className="form-check form-check-inline">
												<label className="form-check-label"> <input
													className="form-check-input wgz_write" type="radio" checked
													name="candidate_languages[write][1]" value="1"/> Yes
												</label>
											</div>
											<div className="form-check form-check-inline">
												<label className="form-check-label"> <input
													className="form-check-input wgz_write" type="radio"
													name="candidate_languages[write][1]" value="0"/> No
												</label>
											</div>
										</td>
										<td>
											<div className="form-check form-check-inline">
												<label className="form-check-label"> <input
													className="form-check-input wgz_understand" type="radio"
													checked name="candidate_languages[understand][1]" value="1"/>
													Yes
												</label>
											</div>
											<div className="form-check form-check-inline">
												<label className="form-check-label"> <input
													className="form-check-input wgz_understand" type="radio"
													  value="0"/> No
												</label>
											</div>
										</td>
										<td><a className="btn btn-xs delete-record-language"
											style={{display: "none"}} data-id="0"><i className="fas fa-trash"></i></a></td>
									</tr>




								</tbody>
							</table>
						</div>
					</div>

					<div className="card">
						<div className="card-header">Technical Skills<span
									className="req">*</span></div>
						<div className="card-body">
							<div className="form-group row">
								<div className="col-12">
									<input className="form-control" type="text" name="skill_name"
										value="{{$skills_section}}" id="wgz_skills"/>
								</div>
							</div>
						</div>
					</div>

					<div className="card">
						<div className="card-header">
							Employment History <span
									className="req">*</span><a
								className="btn btn-primary btn-sm float-right add-employment"
								data-added="0"><i className="fas fa-plus"></i> Add Row</a>
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
										<td><span className="sn"></span></td>
										<td>Name of the Company <textarea className="form-control"
												name="candidate_employments[company_name][]"></textarea>
											Address <textarea className="form-control"
												name="candidate_employments[address][]"></textarea>
											Contact Details <textarea className="form-control"
												name="candidate_employments[contact_details][]"></textarea>
										</td>
										<td><input className="form-control" type="text"
											value="{{$employment->date_from}}"
											name="candidate_employments[date_from][]" autocomplete="nope"/></td>
										<td><input className="form-control" type="text"
											value="{{$employment->date_to}}"
											name="candidate_employments[date_to][]" autocomplete="nope"/></td>
										<td><textarea className="form-control"
												name="candidate_employments[position][]" rows="6"></textarea></td>
										<td><textarea className="form-control"
												name="candidate_employments[reason_of_leaving][]" rows="6"></textarea></td>
										<td><a className="btn btn-xs delete-record-employment"
											
											data-id="{{$em}}"><i className="fas fa-trash"></i></a></td>
									</tr>
									       
						<tr>
										<td><span className="sn">1</span></td>
										<td>Name of the Company <textarea className="form-control"
												name="candidate_employments[company_name][]"></textarea>
											Address <textarea className="form-control"
												name="candidate_employments[address][]"></textarea> Contact
											Details <textarea className="form-control"
												name="candidate_employments[contact_details][]"></textarea>
										</td>
										<td>
										<select className="custom-select "
											name="candidate_employments[date_from][]">
												<option value="">From...</option>									
    									
        									    <option value="{{$j}}"></option>
        									  
									</select>
										</td>
										<td>
										<select className="custom-select"
											name="candidate_employments[date_to][]">
												<option value="">To...</option>									
    									
        									    <option value="{{$k}}"></option>
        									  
									</select></td>
										<td><textarea className="form-control"
												name="candidate_employments[position][]" rows="6"></textarea></td>
										<td>
										<select className="custom-select" name="candidate_employments[reason_of_leaving][]">
									    <option value="">Select Reason</option>
										<option value="Growth Prospects">Growth Prospects</option>
										<option value="Medical Issue">Medical Issue</option>
										<option value="Family Issue">Family Issue</option>
										<option value="Salary Issue">Salary Issue</option>
										<option value="Employee Benefits">Employee Benefits</option>
										<option value="Other">Other</option>
										</select>
										</td>
										<td><a className="btn btn-xs delete-record-employment"
											style={{display: "none"}} data-id="0"><i className="fas fa-trash"></i></a></td>
									</tr>			    
									
									
									
									
									
									
								</tbody>
							</table>
						</div>
					</div>

					<div className="card">
						<div className="card-header">
							FAMILY DETAILS<span
									className="req">*</span> <a
								className="btn btn-primary btn-sm float-right add-family"
								data-added="0"><i className="fas fa-plus"></i> Add Row</a>
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
										<td><span className="sn"></span></td>
										<td><input className="form-control" type="text"
											value="{{$family->name}}" name="candidate_families[name][]"/></td>
										<td><select className="custom-select"
											name="candidate_families[relationship][]">
												<option value="">Relationship</option>
												
         
												
												<option value="{{$rk}}"></option> 
										</select></td>
										<td><input className="form-control" type="number"
											name="candidate_families[age][]" min="0" step="1"
											value="{{$family->age}}"/></td>
										<td><input className="form-control" type="text"
											name="candidate_families[occupation][]"
											value="{{$family->occupation}}"/></td>
										<td><input className="form-control" type="text"
											value="{{$family->name_of_employer}}"
											name="candidate_families[name_of_employer][]"/></td>
										<td><a className="btn btn-xs delete-record-family"
											
											data-id="{{$fa}}"><i className="fas fa-trash"></i></a></td>
									</tr>
								
								    <tr>
										<td><span className="sn">1</span></td>
										<td><input className="form-control" type="text" value=""
											name="candidate_families[name][]"/></td>
										<td><select className="custom-select"
											name="candidate_families[relationship][]">
												<option value="">Relationship</option>
											
												<option value="{{$rk}}"></option> 
										</select></td>
										<td><input className="form-control" type="number"
											name="candidate_families[age][]" min="0" step="1"/></td>
										<td><input className="form-control" type="search"
											name="candidate_families[occupation][]"/></td>
										<td><input className="form-control" type="search"
											name="candidate_families[name_of_employer][]"/></td>
										<td><a className="btn btn-xs delete-record-family"
											style={{display: "none"}} data-id="0"><i className="fas fa-trash"></i></a></td>
									</tr>
							
									
									
								</tbody>
							</table>
						</div>
					</div>

					<div className="card">
						<div className="card-header">Other Information<span
									className="req">*</span></div>
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
										<td> <input type="hidden"
											name="candidate_other_informations[question_id][{{$question->id}}]"
											value="{{$question->id}}"/></td>
										<td>
											<div className="form-check form-check-inline">
												<label className="form-check-label"> <input
													className="form-check-input" type="radio"
													name="candidate_other_informations[status][{{$question->id}}]"
													value="1"/> Yes
												</label>
											</div>
											<div className="form-check form-check-inline">
												<label className="form-check-label"> <input
													className="form-check-input" type="radio"
													name="candidate_other_informations[status][{{$question->id}}]"
													value="0"/> No
												</label>
											</div>
										</td>
										<td><textarea className="form-control" rows="2"
												name="candidate_other_informations[reason][{{$question->id}}]"></textarea></td>
									</tr>
									
								</tbody>
							</table>
						</div>
					</div>


					<div className="card">
						<div className="card-header">Upload CV</div>
						<div className="card-body">
							<div className="form-group row">
								<div className="col-12">
									<input className="form-control" type="file" name="upload_cv"
										value="" id="upload_cv"/> 
									<div id="cv_file_div" style={{padding: "10px 0"}}>
										 <a
											href="{{ asset('/uploads/cv/'.$candidate->cv_file) }}"
											target="_blank"> &nbsp; <i className="fas fa-download"
											style={{color: "green"}}></i></a>
									

									</div>
									<input className="form-control" type="hidden"
										name="upload_cv_remove" value="" id="upload_cv_remove"/>
								</div>
							</div>
						</div>
					</div>



					<div className="row">

						<div className="col-lg-12">
                            <input className="btn btn-success float-right wgz-submit"
								type="submit" name="submit" value="Update Profile"/>
                                <input className="btn btn-success float-right news"
                                name="submit" value="Edit Profile" style={{display: "none"}}/>

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

export default ViewCandidateProfile;
