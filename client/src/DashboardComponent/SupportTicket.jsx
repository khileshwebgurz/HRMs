import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import "../assets/css/ticket.css";
const SupportTicket = () => {
const [ ticket, setTicket] = useState([])
  useEffect(()=>{
    const support = async()=>{
      const data = await axios.get('http://localhost:8000/api/tickets', {withCredentials: true})

setTicket(data.data)
    }
    support();
  },[])
  console.log(ticket, 'daraaa');
  return (
    <>
      <section className="content mt-4 support-ticket">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3">
              <div className="support-ticket-sidebar">
                <ul className="tabs">
                  <li className="tab-link current" data-tab="tab-1">
                    <div className="tab-inner">
                      <span className="tab-name my-tickets">My Tickets</span>
                    </div>
                  </li>
                  <li className="tab-link" data-tab="tab-2">
                    <a href="{{route('em-support-ticket', 'newticket')}}">
                      <div className="tab-inner">
                        <span className="tab-name new-ticket">New Ticket</span>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-9">
              <div className="support-ticket-content">
                <div id="tab-1" className="tab-content current">
                  <div className="card card-primary">
                    <div className="main-header card-header d-flex align-items-center">
                      <h3 className="card-title">My Tickets</h3>
                      <div className="card-actions  d-flex align-items-center">
                        <span
                          className="float-right d-flex align-items-center"
                          id="filter"
                        >
                          <input
                            type="text"
                            className="form-control"
                            name="datefilter"
                            // autocomplete="off"
                            placeholder="Select Filter Date"
                            // readonly
                          />
                        </span>

                        <select id="changestatus">
                          {/* @foreach($filterdata as $key=> $data)
                                    <option value="{{$key}}">{{$data}}</option>
                                    @endforeach */}
                        </select>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive mt-1">
                        <table className="table m wg_allinterviews tickets-list"></table>
                      </div>
                    </div>

                    <div className="card-footer"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2nd section */}
      <section className="content mt-4 support-ticket">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3">
              <div className="support-ticket-sidebar">
                <ul className="tabs">
                  <li className="tab-link current" data-tab="tab-1">
                    <a href="{{route('em-ticket-system', 'alltickets')}}">
                      <div className="tab-inner">
                        <span className="tab-name my-tickets">All Tickets</span>
                      </div>
                    </a>
                  </li>
                  <li className="tab-link" data-tab="tab-2">
                    <a href="{{ route('em-support-ticket', 'newticket') }}">
                      <div className="tab-inner">
                        <span className="tab-name new-ticket">New Ticket</span>
                      </div>
                    </a>
                  </li>
                  <li className="tab-link" data-tab="tab-2">
                    <a href="{{route('em-ticket-system', 'reports')}}">
                      <div className="tab-inner">
                        <span className="tab-name new-ticket">Reports</span>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="user-items">
                <ul className="list-unstyled m-0">
                  <li>
                    <span>Employee Name:</span>
                  </li>
                  <li>
                    <span className="user-id">#IMS:</span>
                  </li>
                  <li>
                    <span>Employee Workstation Number:</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-9">
              <div className="support-ticket-content">
                <div id="tab-1" className="tab-content current">
                  <div className="card card-primary">
                    <div className="main-header card-header d-flex align-items-center">
                      <h3 className="card-title">Ticket Detail</h3>
                    </div>

                    <div className="card-body">
                      <div className="ticket-details-sec">
                        <div className="ticket-status d-flex justify-content-end mb-3">
                          <span className="text-green mr-4">
                            <strong></strong> Open Tickets{" "}
                          </span>
                          <span className="text-red">
                            <strong></strong> Close Tickets
                          </span>
                        </div>
                        <div className="tickets-list">
                          <div className="card-outer">
                            <div className="card">
                              <div className="card-body p-0">
                                <div className="card-header p-0 mb-3">
                                  <div className="card-title">
                                    <h5 className="card-title">
                                      <span>ID :</span> #IMS-{" "}
                                    </h5>
                                  </div>
                                </div>
                                <div className="card-content mb-3">
                                  <div className="card-content-inner">
                                    <div className="card-text mb-2"></div>
                                    <div className="card-desc"></div>
                                  </div>
                                </div>
                              </div>
                              <div className="card-footer p-0">
                                <div className="card-footer-content">
                                  <span className="float-left">
                                    <span className="icon mr-2">
                                      <i className="far fa-clock"></i>
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="ticket-comment">
                              <h6 className="heading">Replies</h6>
                              <ul className="list-unstyled mt-3"></ul>
                            </div>

                            <div className="card-action-buttons">
                              <a
                                href="{{ route('em-ticket-update-status2', $ticket->id) }}"
                                data-id="'.$row->id.'"
                                id="resolved"
                                className="btn btn-sm btn-info"
                              >
                                Resolved
                              </a>

                              <button
                                className="btn btn-sm btn-info"
                                id="loader"
                                type="button"
                                disabled
                              >
                                <span
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Loading...
                              </button>

                              <div id="myDIV" className="mt-3">
                                <form
                                  encType="multipart/form-data"
                                  id="problem"
                                >
                                  <div className="mb-3">
                                    <label className="form-label text-secondary">
                                      ID: #IMS-{" "}
                                    </label>
                                    <input
                                      type="hidden"
                                      name="ticketid"
                                      value="{{ $ticket->id }}"
                                    />
                                    <textarea
                                      type="text"
                                      name="reply"
                                      id="reply"
                                      className="form-control"
                                      rows="5"
                                      cols="2"
                                      placeholder="Enter Your Reply Here"
                                      required
                                    ></textarea>
                                  </div>
                                  <input
                                    className="btn btn-sm btn-info"
                                    type="submit"
                                    value="Submit"
                                    id="submit"
                                    name="submit"
                                  />
                                  <a
                                    href="#"
                                    className="btn btn-sm btn-info"
                                    id="cancel"
                                  >
                                    Cancel
                                  </a>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3rd section */}

      <section className="content mt-4 support-ticket">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3">
              <div className="support-ticket-sidebar">
                <ul className="tabs">
                  <li className="tab-link current" data-tab="tab-1">
                    <a href="{{route('em-support-ticket', 'mytickets')}}">
                      <div className="tab-inner">
                        <span className="tab-name my-tickets">My Tickets</span>
                      </div>
                    </a>
                  </li>
                  <li className="tab-link" data-tab="tab-2">
                    <a href="{{route('em-support-ticket', 'newticket')}}">
                      <div className="tab-inner">
                        <span className="tab-name new-ticket">New Ticket</span>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>

              <div className="user-items">
                <ul className="list-unstyled">
                  <li>
                    <span>Employee Name:</span>
                  </li>
                  <li>
                    <span className="user-id">#IMS:</span>
                  </li>
                  <li>
                    <span>Employee Workstation Number:</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-9">
              <div className="support-ticket-content">
                <div id="tab-1" className="tab-content current">
                  <div className="card card-primary">
                    <div className="main-header card-header d-flex align-items-center">
                      <h3 className="card-title">My Ticket Detail</h3>
                    </div>
                    <div className="card-body">
                      <div className="ticket-details-sec">
                        <div className="tickets-list">
                          <div className="card-outer">
                            <div className="card">
                              <div className="card-body p-0">
                                <div className="card-header p-0 mb-3">
                                  <h5 className="card-title">
                                    <b>ID: #IMS- </b>
                                  </h5>
                                </div>
                                <div className="card-content mb-3">
                                  <div className="card-content-inner">
                                    <div className="card-text mb-2"></div>
                                    <div className="card-desc"></div>
                                  </div>
                                </div>
                              </div>
                              <div className="card-footer p-0">
                                <div className="card-footer-content">
                                  <span className="float-left">
                                    <span className="icon mr-2">
                                      <i className="far fa-clock"></i>
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="ticket-comment">
                              <h6 className="heading">Replies</h6>
                              <ul className="list-unstyled mt-3"></ul>
                            </div>

                            <div className="card-action-buttons">
                              <div id="myDIV" className="mt-3">
                                <form
                                  encType="multipart/form-data"
                                  id="problem"
                                >
                                  @csrf
                                  <div className="mb-3">
                                    <label className="form-label text-secondary">
                                      ID: #IMS-{" "}
                                    </label>
                                    <input
                                      type="hidden"
                                      name="ticketid"
                                      value="{{ $ticket->id }}"
                                    />
                                    <textarea
                                      type="text"
                                      name="reply"
                                      id="reply"
                                      className="form-control"
                                      rows="3"
                                      cols="2"
                                      placeholder="Enter Your Reply Here"
                                      required
                                    ></textarea>
                                  </div>
                                  <input
                                    className="btn btn-sm btn-info"
                                    type="submit"
                                    name="submit"
                                  />
                                  <a
                                    href="#"
                                    className="btn btn-sm btn-info"
                                    id="cancel"
                                  >
                                    Cancel
                                  </a>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4th section */}

      <section className="content mt-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3">
              <div className="support-ticket-sidebar">
                <ul className="tabs" id="tabs">
                  <li className="tab-link current" data-tab="tab-1">
                    <div className="tab-inner">
                      <span className="tab-name my-tickets">All Tickets</span>
                    </div>
                  </li>
                  <li className="tab-link" data-tab="tab-2">
                    <a href="{{ route('em-support-ticket', 'newticket') }}">
                      <div className="tab-inner">
                        <span className="tab-name new-ticket">New Ticket</span>
                      </div>
                    </a>
                  </li>
                  <li className="tab-link" data-tab="tab-2">
                    <a href="{{ route('em-ticket-system', 'reports') }}">
                      <div className="tab-inner">
                        <span className="tab-name new-ticket">Reports</span>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-9">
              <div className="support-ticket-content">
                <div id="tab-1" className="tab-content current">
                  <div className="card card-primary">
                    <div className="main-header card-header d-flex align-items-center">
                      <h3 className="card-title">My Tickets</h3>
                      <div className="card-actions  d-flex align-items-center">
                        <span
                          className="float-right d-flex align-items-center"
                          id="filter"
                        >
                          <input
                            type="text"
                            className="form-control"
                            name="datefilter"
                            // autocomplete="off"
                            placeholder="Select Filter Date"
                            // readonly
                          />
                        </span>

                        <select id="filterstatus"></select>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="ticket-status d-flex justify-content-end mb-3">
                        <span className="text-green mr-4">
                          <strong></strong> Open Tickets{" "}
                        </span>
                        <span className="text-red">
                          <strong></strong> Close Tickets
                        </span>
                      </div>

                      <div className="table-responsive mt-1">
                        <table className="table wg_allinterviews tickets-table">
                          <thead>
                            <tr>
                              <th>Ticket No</th>
                              <th>Type</th>
                              <th>Work Station Code</th>
                              <th>Level</th>
                              <th>Employee Name</th>
                              <th>Status</th>
                              <th>Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody></tbody>
                        </table>
                      </div>
                    </div>

                    <div className="card-footer"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5th section */}

      {/* <section className="content mt-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3">
              <div className="support-ticket-sidebar">
                <ul className="tabs" id="tabs">
                  <li className="tab-link " data-tab="tab-1">
                    <a href="{{ route('em-ticket-system', 'alltickets') }}">
                      <div className="tab-inner">
                        <span className="tab-name my-tickets">All Tickets</span>
                      </div>
                    </a>
                  </li>
                  <li className="tab-link" data-tab="tab-2">
                    <a href="{{ route('em-support-ticket', 'newticket') }}">
                      <div className="tab-inner">
                        <span className="tab-name new-ticket">New Ticket</span>
                      </div>
                    </a>
                  </li>
                  <li className="tab-link current" data-tab="tab-2">
                    <div className="tab-inner">
                      <span className="tab-name new-ticket">Reports</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-9">
              <div className="support-ticket-content">
                <div className="card card-primary">
                  <div className="main-header card-header d-flex align-items-center">
                    <h3 className="card-title">Reports</h3>
                    <div className="card-actions  d-flex align-items-center">
                      <div
                        id="reportrange"
                        style={{
                          cursor: "pointer",
                          padding: "0px 10px",
                          border: "1px solid rgba(255,255,255,.5)",
                        }}
                      >
                        <i className="fa fa-calendar"></i>&nbsp;
                        <span></span> <i className="fa fa-caret-down"></i>
                      </div>
                    </div>
                  </div>
                  <div className="card-body" id="message">
                    <figure className="highcharts-figure">
                      <span>
                        <b>Total:- </b>
                        <span id="countall"> </span>{" "}
                      </span>
                      <span className="float-right">
                        <b>Total Average:- </b>
                        <span id="countage"> </span>{" "}
                      </span>
                      <div id="container"></div>
                      <span>
                        <b>P1- Service Unuseable in Production:- </b>
                        <span id="countp1"> </span>{" "}
                      </span>
                      <span>
                        <b>P2- Service Partially not working:- </b>
                        <span id="countp2"> </span>{" "}
                      </span>
                      <span>
                        <b>P3- Service Partially Impaired:- </b>
                        <span id="countp3"> </span>{" "}
                      </span>
                      <span>
                        <b>P4- Service Useable:- </b>
                        <span id="countp4"> </span>{" "}
                      </span>
                    </figure>
                  </div>
                  <div className="card-footer" id="cout"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* 6th section */}

      {/* <section class="content mt-4 support-ticket">
        <div class="container-fluid">
          <div class="row">
            <div class="col-lg-3">
              <div class="support-ticket-sidebar">
                <ul class="tabs"></ul>
              </div>
            </div>
            <div class="col-lg-9">
              <div class="support-ticket-content">
                <div class="card card-primary add-tickets">
                  <div class="main-header card-header">
                    <h3 class="card-title">New Ticket</h3>
                  </div>
                  <div class="card-body" id="message">
                    <div class="table-responsive mt-1">
                      <form enctype="multipart/form-data" id="problem">
                        <input
                          type="hidden"
                          name="user_role"
                          value="<?php echo Auth::user()->user_role; ?>"
                        />
                        <div class="mb-3">
                          <label class="form-label">Incident Type</label>
                          <select
                            class="browser-default custom-select"
                            name="issue"
                            id="incident"
                          >
                            <option value="select">Select</option>
                            <option value="Hardware">Hardware</option>
                            <option value="Software">Software</option>
                            <option value="Server">Hosting Server</option>
                            <option value="Internet">Internet & Network</option>
                          </select>
                          <span class="text-danger" id="incident_msg">
                            Please select incident type.
                          </span>
                        </div>

                        <div class="mb-3">
                          <label class="form-label">Issue Level</label>
                          <select
                            class="browser-default custom-select"
                            name="level"
                            id="issue"
                          >
                            <option value="select">Select</option>
                            <option
                              value="P1"
                              id="p1"
                              data-name="Your issue solve in 30 to 60 minutes."
                            >
                              P1- Service Unuseable in Production
                            </option>
                            <option
                              value="P2"
                              id="p2"
                              data-name="Your issue solve upto 2 Hours."
                            >
                              P2- Service Partially not working
                            </option>
                            <option
                              value="P3"
                              id="p3"
                              data-name="Your issue solve upto 8 Hours."
                            >
                              P3- Service Partially Impaired
                            </option>
                            <option
                              value="P4"
                              id="p4"
                              data-name="Your issue solve upto 48 Hours."
                            >
                              P4- Service Useable
                            </option>
                          </select>
                          <span class="text-danger" id="issue_msg">
                            Please select issue level.
                          </span>
                          <span class="text-success" id="p1_msg"></span>
                        </div>

                        <div class="mb-3">
                          <label class="form-label">Employee</label>
                          <select
                            class="browser-default custom-select"
                            name="employee"
                            id="employee"
                          >
                            <option value="select">Select</option>
                          </select>
                        </div>
                        <div class="mb-3">
                          <label for="name" class="form-label">
                            Description
                          </label>
                          <textarea
                            name="description"
                            class="form-control"
                            cols="3"
                            id="description"
                            rows="3"
                            placeholder="Describe Your Problem Here"
                          ></textarea>
                          <span class="text-danger" id="message_description">
                            Please fill description
                          </span>
                        </div>

                        <input
                          type="submit"
                          class="btn primary-site-main-btn text-uppercase border-radius-0"
                          name="submit"
                          id="submit"
                          value="Submit"
                        />
                        <button
                          class="btn primary-site-main-btn text-uppercase border-radius-0"
                          id="loader"
                          type="button"
                          disabled
                        >
                          <span
                            class="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Loading...
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </>
  );
};

export default SupportTicket;
