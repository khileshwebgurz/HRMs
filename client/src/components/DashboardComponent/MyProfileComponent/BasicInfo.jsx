
import BasicInfoSection from "./BasicInfo/BasicInfoSection";
import ContactInfo from "./BasicInfo/ContactInfo";
import BankInfo from "./BasicInfo/BankInfo";

const BasicInfo = ({ employeedata }) => {

  console.log('basic info empojsjsjhfbsd', employeedata)
  return (
    <>
      <section className="content info-sec">
        <div className="container-fluid" id="personalForm">
          {/* <div className="tab-content" id="custom-tabs-four-tabContent"></div> */}
          <div id="custom-tabs-four-tabContent" className="row">
            <div className="col-lg-12">
              <BasicInfoSection  employeeData={employeedata}/>

              <ContactInfo employeeData={employeedata} />

              <BankInfo employeeData={employeedata} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BasicInfo;
