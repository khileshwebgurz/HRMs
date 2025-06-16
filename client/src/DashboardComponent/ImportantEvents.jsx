import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
const ImportantEvents = () => {
  const [calendarData, setCalendarData] = useState([]);

  useEffect(() => {
    const fetchingCalendar = async () => {
      const data = await axios(`${import.meta.env.VITE_API_BASE_URL}/calender`,{ withCredentials: true });
      setCalendarData(data.data);
    };
    fetchingCalendar();
  }, []);

  console.log('my calendar data is >>>',calendarData);

  return (
    <>
      <section className="content mt-4 calendar-page">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-primary">
                <div className="card-header">
                  <h3 className="card-title">Calender</h3>
                </div>
                <div className="card-body p-0">
                  <section className="content">
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-lg-9 p-0">
                          <div className="card card-primary">
                            <div className="card-body p-0">
                              <div id="calendar"></div>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-3 pl-0 pl-lg-2 pr-0">
                          <div className="sticky-top mb-3 notification-sidebar">
                            <div className="card">
                              <div className="card-header">
                                <h4 className="card-title">Notifications</h4>
                              </div>
                              <div className="card-body p-0">
                                <div id="external-events">
                                  <div className="birthday p-1 mt-2">
                                    <div className="headings pb-2 d-flex justify-content-between">
                                      <h5>Today's Birthday</h5>
                                    </div>
                                    <ul>{/* birthday data */}</ul>
                                  </div>
                                  <div className="anniversary p-1 mt-2">
                                    <div className="headings pb-2 d-flex justify-content-between">
                                      <h5>Today's Anniversary</h5>
                                    </div>
                                    <ul>{/* anniversay data */}</ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ImportantEvents;
