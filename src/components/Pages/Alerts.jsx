import React, { Component } from "react";
import { alerts_det } from "../urls/api";
import axios from "axios";
import $ from "jquery";
import { linkClicked } from "../sidebar/Leftsidebar";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export default class Alerts extends Component {
  constructor() {
    super();
    this.state = {
      message: "",
      error: false,
      success: false,
    };
  }
  componentDidMount() {
    linkClicked(4);
    this.alertType();
  }

  alertType = () => {
    if ($("#alerttype").val() === 'Asset') {
      $("#temp_table").hide();
      $("#asset_table").show();
      $("#humid_table").hide();
      $("#freefall_table").hide();
      axios({ method: "GET", url: "/api/alert?value=" + 1 })
        .then((response) => {
          console.log(response, 'assetlert======');
          if (response.status === 200 && response.data.length !== 0) {
            let data = response.data;
            if (data.length > 11) {
              $('#divheight').css('height', 'fit-content')
            }
            $("#assetalert ").empty();
            for (let i = 0; i < data.length; i++) {
              $("#assetalert").append(
                "<tr><td>" +
                (i + 1) +
                "</td><td>" +
                data[i].macid.tagid +
                "</td><td>" +
                "Asset" +
                "</td><td>" +
                data[i].lastseen.replace("T", " ").substr(0, 19) +
                "</td></tr>"
              );
            }
          } else {
            $("#alerts_table ").empty();
            this.setState({
              error: true,
              message: "No Alert Data Found For Asset.",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
            $("#content").text("User Session has timed out. Please Login again");
          }
          else if (error.response.status === 404) {
            this.setState({
              error: true,
              message: "No Alert Data Found.",
            });
          }
          else if (error.response.status === 400) {
            this.setState({
              error: true,
              message: "Request Failed.",
            });
          } else {
            this.setState({
              error: true,
              message: "Error occurred. Please try again.",
            });
          }
        });
    }

    else if ($("#alerttype").val() === 'Temperature') {
      this.setState({ error: false, message: '' });
      $("#temp_table").show();
      $("#asset_table").hide();
      $("#humid_table").hide();
      $("#freefall_table").hide();
      axios({ method: "GET", url: "/api/alert?value=" + 8 })
        .then((response) => {
          console.log(response, 'templert======');
          if (response.status === 200 && response.data.length !== 0) {
            let data = response.data;
            $("#tempalert").empty();
            for (let i = 0; i < data.length; i++) {
              $("#tempalert").append(
                "<tr><td>" +
                (i + 1) +
                "</td><td>" +
                data[i].macid.tagid +
                "</td><td>" +
                data[i].temperature +
                "</td><td>" +
                data[i].lastseen.replace("T", " ").substr(0, 19) +
                "</td></tr>"
              );
            }
          } else {
            $("#tempalert").empty();
            this.setState({
              error: true,
              message: "No Alert Data Found For Temperature.",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
            $("#content").text("User Session has timed out. Please Login again");
          }
          else if (error.response.status === 404) {
            this.setState({
              error: true,
              message: "No Alert Data Found.",
            });
          }
          else if (error.response.status === 400) {
            this.setState({
              error: true,
              message: "Request Failed.",
            });
          } else {
            this.setState({
              error: true,
              message: "Error occurred. Please try again.",
            });
          }
        });
    }

    else if ($("#alerttype").val() === 'Humidity') {
      this.setState({ error: false, message: '' });
      $("#temp_table").hide();
      $("#asset_table").hide();
      $("#humid_table").show();
      $("#freefall_table").hide();
      axios({ method: "GET", url: "/api/alert?value=" + 9 })
        .then((response) => {
          console.log(response, 'humidlert======');
          if (response.status === 200 && response.data.length !== 0) {
            let data = response.data;
            $("#humidalert").empty();
            for (let i = 0; i < data.length; i++) {
              $("#humidalert").append(
                "<tr><td>" +
                (i + 1) +
                "</td><td>" +
                data[i].macid.tagid +
                "</td><td>" +
                data[i].humidity +
                "</td><td>" +
                data[i].lastseen.replace("T", " ").substr(0, 19) +
                "</td></tr>"
              );
            }
          } else {
            $("#humidalert").empty();
            this.setState({
              error: true,
              message: "No Alert Data Found For Humidity.",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
            $("#content").text("User Session has timed out. Please Login again");
          }
          else if (error.response.status === 404) {
            this.setState({
              error: true,
              message: "No Alert Data Found.",
            });
          }
          else if (error.response.status === 400) {
            this.setState({
              error: true,
              message: "Request Failed.",
            });
          } else {
            this.setState({
              error: true,
              message: "Error occurred. Please try again.",
            });
          }
        });
    }

    else if ($("#alerttype").val() === 'Free Fall') {
      this.setState({ error: false, message: '' });
      $("#temp_table").hide();
      $("#asset_table").hide();
      $("#humid_table").hide();
      $("#freefall_table").show();
      axios({ method: "GET", url: "/api/alert?value=" + 3 })
        .then((response) => {
          console.log(response, 'freefalllert======');
          if (response.status === 200 && response.data.length !== 0) {
            let data = response.data;
            $("#freefallalert").empty();
            for (let i = 0; i < data.length; i++) {
              $("#freefallalert").append(
                "<tr><td>" +
                (i + 1) +
                "</td><td>" +
                data[i].macid.tagid +
                "</td><td>" +
                "Free Fall" +
                "</td><td>" +
                data[i].lastseen.replace("T", " ").substr(0, 19) +
                "</td></tr>"
              );
            }
          } else {
            $("#freefallalert").empty();
            this.setState({
              error: true,
              message: "No Alert Data Found For Free Fall.",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
            $("#content").text("User Session has timed out. Please Login again");
          }
          else if (error.response.status === 404) {
            this.setState({
              error: true,
              message: "No Alert Data Found.",
            });
          }
          else if (error.response.status === 400) {
            this.setState({
              error: true,
              message: "Request Failed.",
            });
          } else {
            this.setState({
              error: true,
              message: "Error occurred. Please try again.",
            });
          }
        });
    }
  }


  componentWillUnmount = () => {
    clearTimeout(this.timeout);
  };

  sessionTimeout = () => {
    $("#displayModal").css("display", "none");
    sessionStorage.removeItem('isLogged')
    window.location.pathname = '/login'
  };

  render() {
    const { error, message, success } = this.state;
    return (
      <div
        style={{
          float: "right",
          width: "95%",
          background: "#E5EEF0",
          height: "100vh",
          marginLeft: "60px",
        }}
      >
        <div style={{ marginTop: "30px", marginLeft: "60px" }}>
          <span className="main_header">ALERTS</span>

          <div className="underline"></div>

          {error && (
            <div
              style={{ color: "red", marginBottom: "20px", marginTop: "30px" }}
            >
              <strong>{message}</strong>
            </div>
          )}

          {success && (
            <div
              style={{
                color: "green",
                marginBottom: "20px",
                marginTop: "30px",
              }}
            >
              <strong>{message}</strong>
            </div>
          )}
          <div style={{ marginTop: "30px" }}>
            <span className="label">Alert:</span>
            <select style={{ marginBottom: '30px' }}
              name="alerttype"
              id="alerttype"
              required="required"
              onChange={this.alertType}
            >
              <option>Asset</option>
              <option>Temperature</option>
              <option>Humidity</option>
              <option>Free Fall</option>
            </select>

            <table id="asset_table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>ASSET MAC ID</th>
                  <th>TYPE</th>
                  <th>LAST SEEN</th>
                </tr>
              </thead>
              <tbody id='assetalert'></tbody>
            </table>

            <table id="temp_table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>MAC ID</th>
                  <th>TEMPERATURE</th>
                  <th>LAST SEEN</th>
                </tr>
              </thead>
              <tbody id='tempalert'></tbody>
            </table>

            <table id="humid_table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>MAC ID</th>
                  <th>HUMIDITY</th>
                  <th>LAST SEEN</th>
                </tr>
              </thead>
              <tbody id='humidalert'></tbody>
            </table>

            <table id="freefall_table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>MAC ID</th>
                  <th>Alert Type</th>
                  <th>LAST SEEN</th>
                </tr>
              </thead>
              <tbody id='freefallalert'></tbody>
            </table>


          </div>
        </div>
        <div id="displayModal" className="modal">
          <div className="modal-content">
            <p id="content" style={{ textAlign: "center" }}></p>
            <button style={{ textAlign: "center" }}
              id="ok"
              className="btn-center btn success-btn"
              onClick={this.sessionTimeout}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  }
}
