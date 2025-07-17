import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from '@fullcalendar/bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import timeGridPlugin from '@fullcalendar/timegrid';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [anniversaries, setAnniversaries] = useState([]);

  useEffect(() => {
    const fetchingCalendar = async () => {
      try {
        const response = await axios(`${import.meta.env.VITE_API_BASE_URL}/calender`, {
          withCredentials: true
        });

        const allEvents = response.data;
        setEvents(allEvents);

        const today = new Date().toISOString().slice(5, 10); // MM-DD

        const todayBirthdays = allEvents.filter(event =>
          event.title === 'Birthday' && event.start.slice(5, 10) === today
        );
        const todayAnniversaries = allEvents.filter(event =>
          event.title === 'Work Anniversary' && event.start.slice(5, 10) === today
        );

        setBirthdays(todayBirthdays);
        setAnniversaries(todayAnniversaries);

      } catch (error) {
        console.error("Failed to fetch calendar data", error);
      }
    };

    fetchingCalendar();
  }, []);


  const renderEventContent = (eventInfo) => (
    <div>
      <i className={`fas ${eventInfo.event.extendedProps.icon}`}></i> {' '}
      <strong>{eventInfo.event.title}</strong><br />
      <small>{eventInfo.event.extendedProps.description}</small>
    </div>
  );

  return (
    <section className="content mt-4">
      <div className="container-fluid">
        <div className="row">
          {/* Calendar */}
          <div className="col-lg-9">
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">Calendar</h3>
              </div>
              <div className="card-body p-0">
                <FullCalendar
                 plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrapPlugin]}
                  //plugins={[dayGridPlugin, interactionPlugin, bootstrapPlugin]}
                  themeSystem='bootstrap'
                  initialView='dayGridMonth'
                  events={events}
                  eventContent={renderEventContent}
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Notification Sidebar */}
          <div className="col-lg-3">
            <div className="sticky-top mb-3">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Notifications</h4>
                </div>
                <div className="card-body">
                  {/* Birthday */}
                  <div className="mb-3">
                    <h5>Today's Birthdays</h5>
                    <ul className="list-unstyled">
                      {birthdays.length > 0 ? birthdays.map((item, index) => (
                        <li key={index}>{item.description}</li>
                      )) : <li>No birthdays today</li>}
                    </ul>
                  </div>
                  {/* Work Anniversary */}
                  <div>
                    <h5>Today's Anniversaries</h5>
                    <ul className="list-unstyled">
                      {anniversaries.length > 0 ? anniversaries.map((item, index) => (
                        <li key={index}>{item.description}</li>
                      )) : <li>No anniversaries today</li>}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End Sidebar */}
        </div>
      </div>
    </section>
  );
};

export default Calendar;
