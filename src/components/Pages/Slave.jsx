import React, { Component } from "react";
import axios from "axios";
import $ from "jquery";
import { SessionOut } from "./Common";
import { master_register, slave_register } from "../urls/api";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export default class Slave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      error: false,
      success: false,
    };
  }
  componentDidMount() {
    axios({ method: "GET", url: master_register })
      .then((response) => {
        // console.log(response);
        if (response.status === 200 && response.data.length !== 0) {
          for (let i = 0; i < response.data.length; i++) {
            $("#masterid").append(
              "<option value=" +
                response.data[i].id +
                ">" +
                response.data[i].gatewayid +
                "</option>"
            );
          }
        } else {
          this.setState({
            success: false,
            error: true,
            message: "No master gateway is found.",
          },
          () => setTimeout( () => this.setState({ message: '' }) ,5000));
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          this.setState({
            success: false,
            error: true,
            message: "User session had timed out. Please login again.",
          },
          () => setTimeout( () => this.setState({ message: '' }) ,5000));
          this.timeout = setTimeout(() => {
            sessionStorage.setItem("isLogged", "failed");
            window.location.pathname = "/";
          }, 1000 * 2);
        } else {
          this.setState({
            success: false,
            error: true,
            message: "Error occurred. Please try again.",
          },
          () => setTimeout( () => this.setState({ message: '' }) ,5000));
        }
      });
  }
  registerSlave = () => {
    let data = {
      masterid: $("#masterid").val(),
      macaddress: $("#slaveregid").val(),
    };
    console.log(data);
    if ($("#slaveregid").val().length === 0) {
      $("#text")
        .hide()
        .html("Slave Gateway ID must be filled out")
        .fadeIn("slow");
      setTimeout(function () {
        $("#text").hide();
      }, 3000);
    } else {
      axios({ method: "POST", url: slave_register, data: data }).then(
        (response) => {
          if (response.status === 200 || response.status === 201) {
            $("#slaveregid").val("");
            this.setState({
              success: true,
              error: false,
              message: "Master Gateway is registered successfully.",
            },
            () => setTimeout( () => this.setState({ message: '' }) ,5000));
          } else {
            this.setState({
              success: false,
              error: true,
              message: "Master Gateway  is not registered",
            },
            () => setTimeout( () => this.setState({ message: '' }) ,5000));
          }
        }
      );
    }
  };

  removeSlave = () => {
    let data = {
      macaddress: $("#slaveremv").val(),
    };
    if ($("#slaveremv").val().length === 0) {
      $("#text")
        .hide()
        .html("Slave Gateway ID must be filled out")
        .fadeIn("slow");
      setTimeout(function () {
        $("#text").hide();
      }, 3000);
    } else {
      axios({
        method: "DELETE",
        url: slave_register,
        data: data,
      })
        .then((response) => {
          console.log(response);
          if (response.status === 200 || response.status === 201) {
            $("#slaveremv").val("");
            $("#removeslave").hide();
            this.setState({
              success: true,
              error: false,
              message: "Slave Gateway is removed successfully.",
            },
            () => setTimeout( () => this.setState({ message: '' }) ,5000));
          } else {
            this.setState({
              success: false,
              error: true,
              message: "Slave Gateway is not removed.",
            },
            () => setTimeout( () => this.setState({ message: '' }) ,5000));
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 403) {
            this.setState({
              success: false,
              error: true,
              message: "User session had timed out. Please login again.",
            },
            () => setTimeout( () => this.setState({ message: '' }) ,5000));
            this.timeout = setTimeout(() => {
              sessionStorage.setItem("isLogged", "failed");
              window.location.pathname = "/";
            }, 1000 * 2);
          } else {
            this.setState({
              success: false,
              error: true,
              message: "Error occurred. Please try again.",
            },
            () => setTimeout( () => this.setState({ message: '' }) ,5000));
          }
        });
    }
  };
  remove = () => {
    document.getElementById("removeslave").style.display =
      $("#removeslave").css("display") === "block" ? "none" : "block";
  };
  sessionTimeout = () => {
    $("#displayModal").css("display", "none");
    sessionStorage.removeItem('isLogged')
    window.location.pathname='/login'
  };
  render() {
    const { message, error, success } = this.state;

    return (
      <div style={{
        marginLeft: "0px",
        marginTop:'20px',
        width: "100%",
        height: "67vh"
      }}>
        <div style={{ marginTop: "30px", justifyContent: "space-between" }}>
          <b>
            {" "}
            <p id="text" style={{ color: "red" }}></p>
          </b>
          {error && (
            <div style={{ color: "red", marginBottom: "20px" }}>
              <strong>{message}</strong>
            </div>
          )}

          {success && (
            <div style={{ color: "green", marginBottom: "20px" }}>
              <strong>{message}</strong>
            </div>
          )}

          <div>
            {/* <span className='regmaster_header'>Register Master</span> */}
            <div className="inputdiv">
              <span className="label">Master Gateway ID:</span>
              <select name="masterid" id="masterid" required="required" />
            </div>

            <div className="inputdiv">
              <span className="label">Slave Gateway ID :</span>
              <input
                type="text"
                name="id"
                id="slaveregid"
                required="required"
                placeholder="5a-c2-15-0a-00-00"
              />
            </div>

            <div style={{ display: "flex", width: "85%" }}>
              <div
                className="register"
                style={{ width: "170px", marginLeft: "17px" }}
              >
                <div
                  onClick={this.registerSlave}
                  style={{
                    marginLeft: "9px",
                    marginTop: "5px",
                    color: "white",
                    cursor: "pointer",
                    fontFamily: "Poppins-Regular",
                  }}
                >
                  Register Slave
                </div>
                <div>
                  <i
                    style={{
                      fontSize: "20px",
                      marginLeft: "10px",
                      marginTop: "5px",
                      color: "white",
                    }}
                    className="fas fa-file-plus"
                  ></i>
                </div>
              </div>
              <div
                className="remove"
                onClick={this.remove}
                style={{ width: "170px", marginLeft: "60px" }}
              >
                <div
                  style={{
                    marginLeft: "9px",
                    marginTop: "5px",
                    color: "white",
                    cursor: "pointer",
                    fontFamily: "Poppins-Regular",
                  }}
                >
                  Remove Slave
                </div>
                <div>
                  <i
                    style={{
                      fontSize: "20px",
                      marginLeft: "10px",
                      marginTop: "5px",
                      color: "white",
                    }}
                    className="fas fa-file-times"
                  ></i>
                </div>
              </div>
            </div>

            <div
              id="removeslave"
              style={{ marginTop: "40px", display: "none" }}
            >
              <div className="inputdiv">
                <span className="label">Slave Gateway ID :</span>
                <input
                  type="text"
                  name="id"
                  id="slaveremv"
                  required="required"
                />
                <div
                  className="remove"
                  style={{ width: "170px", marginLeft: "225px" }}
                >
                  <div
                    onClick={this.removeSlave}
                    style={{
                      marginLeft: "9px",
                      marginTop: "5px",
                      color: "white",
                      cursor: "pointer",
                      fontFamily: "Poppins-Regular",
                    }}
                  >
                    Remove Slave
                  </div>
                  <div>
                    <i
                      style={{
                        fontSize: "20px",
                        marginLeft: "10px",
                        marginTop: "5px",
                        color: "white",
                      }}
                      className="fas fa-file-times"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
       
        {/* SessionOut Component used here!  */}
        <SessionOut />
      </div>
    );
  }
}
