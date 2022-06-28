import axios from "axios";
import React, { Component } from "react";
import { upload_floormap, master_register } from "../urls/api";
import $ from "jquery";
import { SessionOut } from "./Common";

export default class Master extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      error: false,
      success: false,
    };
  }
  componentDidMount() {
    axios({
      method: "GET",
      url: upload_floormap,
    })
      .then((response) => {
        console.log(response);
        let data = response.data;
        if (data.length !== 0 && response.status === 200) {
          for (let i = 0; i < data.length; i++) {
            $("#fname").append(
              "<option  value=" + data[i].id + " >" + data[i].name + "</option>"
            );
          }
        } else {
          this.setState({
            error: true,
            message:
              "No floor map uploaded. Please upload a floor map to begin",
          },
          () => setTimeout( () => this.setState({ message: '' }) ,5000));
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 403) {
          $("#displayModal").css("display", "block");
          // $("#content").text("User Session has timed out. Please Login again");
        }
      });
  }
  registerMaster = () => {
    let data = {
      floorid: $("#fname").val(),
      macaddress: $("#masterregid").val(),
    };
    console.log(data);
    if ($("#masterregid").val().length === 0) {
      $("#text")
        .hide()
        .html("Master Gateway ID must be filled out")
        .fadeIn("slow");
      setTimeout(function () {
        $("#text").hide();
      }, 3000);
    } else {
      axios({ method: "POST", url: master_register, data: data }).then(
        (response) => {
          if (response.status === 200 || response.status === 201) {
            $("#masterregid").val("");
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

  removeMaster = () => {
    let data = {
      macaddress: $("#masterremv").val(),
    };
    if ($("#masterremv").val().length === 0) {
      $("#text")
        .hide()
        .html("Master Gateway ID must be filled out")
        .fadeIn("slow");
      setTimeout(function () {
        $("#text").hide();
      }, 3000);
    } else {
      axios({
        method: "DELETE",
        url: master_register,
        data: data,
      })
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            $("#masterremv").val("");
            $("#masterremv").hide();
            this.setState({
              success: true,
              error: false,
              message: "Master Gateway is removed successfully.",
            },
            () => setTimeout( () => this.setState({ message: '' }) ,5000));
          } else {
            this.setState({
              success: false,
              error: true,
              message: "Master Gateway is not removed.",
            },
            () => setTimeout( () => this.setState({ message: '' }) ,5000));
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
            // $("#content").text("User Session has timed out. Please Login again");
          }
        });
    }
  };
  remove = () => {
    document.getElementById("removemaster").style.display =
      $("#removemaster").css("display") === "block" ? "none" : "block";
  };

  sessionTimeout = () => {
    $("#displayModal").css("display", "none");
    sessionStorage.removeItem('isLogged')
    window.location.pathname='/login'
  };


  render() {
    const { message, success, error } = this.state;

    return (
      <div  style={{
        marginLeft: "0px",
        marginTop:'20px',
        width: "100%",
        height: "68.5vh"
      }}>
        <div style={{ justifyContent: "space-between" }}>
          <b>
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
            <div className="inputdiv">
              <span className="label">Floor Name :</span>
              <select name="fname" id="fname" required="required" />
            </div>

            <div className="inputdiv">
              <span className="label">Master Gateway ID :</span>
              <input
                type="text"
                name="id"
                id="masterregid"
                required="required"
                placeholder="5a-c2-15-00-00-00"
              />
            </div>

            <div style={{ display: "flex", width: "85%" }}>
              <div
                className="register"
                style={{ width: "170px", marginLeft: "17px" }}
              >
                <div
                  onClick={this.registerMaster}
                  style={{
                    marginLeft: "9px",
                    marginTop: "5px",
                    color: "white",
                    cursor: "pointer",
                    fontFamily: "Poppins-Regular",
                  }}
                >
                  Register Master
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
                  Remove Master
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
              id="removemaster"
              style={{ marginTop: "40px", display: "none" }}
            >
              <div className="inputdiv">
                <span className="label">Master Gateway ID :</span>
                <input
                  type="text"
                  name="id"
                  id="masterremv"
                  required="required"
                />
                <div
                  className="remove"
                  style={{ width: "170px", marginLeft: "225px" }}
                >
                  <div
                    onClick={this.removeMaster}
                    style={{
                      marginLeft: "9px",
                      marginTop: "5px",
                      color: "white",
                      cursor: "pointer",
                      fontFamily: "Poppins-Regular",
                    }}
                  >
                    Remove Master
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
