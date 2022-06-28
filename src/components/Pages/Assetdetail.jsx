import React, { Component } from "react";
import axios from "axios";
import $ from "jquery";
import { upload_floormap, asset_rack_det, assettag_det } from "../urls/api";
import { getPagination, TableDetails, SessionOut } from "./Common";
import { linkClicked } from "../sidebar/Leftsidebar";


axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export default class Assetdetail extends Component {
  constructor() {
    super();
    this.state = {
      message: "",
      error: false,
      flag: false,
    };
  }

  componentDidMount() {
    linkClicked(5)
    this.setState({ flag: true });
    axios({ method: "GET", url: upload_floormap })
      .then((response) => {
        if (response.status === 200 && response.data.length !== 0) {
          for (let i = 0; i < response.data.length; i++) {
            $("#fname").append(
              "<option value=" +
              response.data[i].id +
              ">" +
              response.data[i].name +
              "</option>"
            );
          }
          this.getTableDetails();
          this.interval = setInterval(() => {
            this.getTableDetails();
          }, 15 * 1000);
        } else {
          this.setState({
            error: true,
            message: "No floor Map Details Found.",
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          $("#displayModal").css("display", "block");
          $("#content").text("User Session has timed out. Please Login again");
        } else {
          this.setState({
            error: true,
            message: "Error occurred. Please try again.",
          },
            () => setTimeout(() => this.setState({ message: '' }), 5000));
        }
      });
  }

  getTableDetails = () => {
    this.setState({ message: "", error: false });
    let activeBtn = $('.myDIV').find('button.active').attr('id');
    if (activeBtn === "rackBtn") {
      axios({ method: "GET", url: asset_rack_det + $("#fname").val() })
        .then((response) => {
          const data = response.data;
          console.log("rackBtn=====>", data);
          $(".pagination").hide();
          $("#rangeDropdown").hide();

          $("#table_det tbody").empty();
          $("#table_det thead").empty();
          if (data.length !== 0 && response.status === 200) {
            $("#table_det thead").append(
              "<tr>" +
              "<th>SNO</th>" +
              "<th>RACK ID</th>" +
              "<th>CAPACITY</th>" +
              "<th>LASTSEEN</th>" +
              "</tr>"
            );
            for (let i = 0; i < data.length; i++) {
              $("#table_det tbody").append(
                "<tr><td>" +
                (i + 1) +
                "</td><td>" +
                data[i].macid +
                "</td><td>" +
                data[i].capacity +
                "</td><td>" +
                data[i].timestamp.substring(0, 19).replace("T", " ") +
                "</td></tr>"
              )
            }
            if (data.length > 25) {
              $(".pagination").show();
              $("#rangeDropdown").show();
              $('#divheight').css('height', 'fit-content')
              getPagination(this, "#table_det");
            } else {
              $('#divheight').css('height', '100vh')
            }
            if (data.length > 10) {
              $('#divheight').css('height', 'fit-content')
            }
          } else {
            $('#divheight').css('height', '100vh')
            this.setState({ message: "No Rack Details found!", error: true });
          }
        })

        .catch((error) => {
          console.log("ERROR====>", error);
          if (error.response.status === 404) {
            this.setState({ error: true, message: 'No Health Data Found For Master' })
          } else if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
            $("#content").text("User Session has timed out. Please Login again");
          }
        })
    }
    else if (activeBtn === "assetBtn") {
      axios({ method: "GET", url: assettag_det })
        .then((response) => {
          const data = response.data;
          console.log('assettag_det=====>', response.data);
          $(".pagination").hide();
          $("#rangeDropdown").hide();
          $("#table_det tbody").empty();
          $("#table_det thead").empty();
          if (data.length !== 0 && response.status === 200) {
            $("#table_det thead").append(
              "<tr>" +
              "<th>SNO</th>" +
              "<th>ASSET ID</th>" +
              "<th>RACK ID</th>" +
              "<th>UNIT USAGE</th>" +
              "<th>LAST SEEN</th>" +
              "<th>STATUS</th>" +
              "</tr>"
            );
            for (let i = 0; i < data.length; i++) {
              let status = "red";
              if (new Date() - new Date(data[i].lastseen) <= 2 * 60 * 1000) {
                status = "green";
              }
              $("#table_det tbody").append(
                "<tr><td>" +
                (i + 1) +
                "</td><td>" +
                data[i].tagid +
                "</td><td>" +
                data[i].rackno.macid +
                "</td><td>" +
                data[i].usage +
                "</td><td>" +
                data[i].lastseen.replace("T", " ").substr(0, 19) +
                "</td>" +
                "<td><div id='outer_" + status + "'><div id='inner_" + status + "'></div></div></td > " +
                "</tr>"
              );
            }
            if (data.length > 25) {
              $(".pagination").show();
              $("#rangeDropdown").show();
              $('#divheight').css('height', 'fit-content')
              getPagination(this, "#table_det");
            } else {
              $('#divheight').css('height', '100vh')
            }
            if (data.length > 10) {
              $('#divheight').css('height', 'fit-content')
            }
          } else {
            $('#divheight').css('height', '100vh')
            this.setState({ message: "No Asset Details found!", error: true });
          }
        })
        .catch((error) => {
          console.log('Health Slave gate Error====', error);
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
            $("#content").text("User Session has timed out. Please Login again");
          }
        })
    }
  };

  btnOption = (e) => {
    $(".myDIV").parent().find('button').removeClass("active");
    this.setState({ flag: true });
    $("#" + e.target.id).addClass("active");
    this.getTableDetails()
  }


  sessionTimeout = () => {
    $("#displayModal").css("display", "none");
    sessionStorage.removeItem('isLogged')
    window.location.pathname = '/login'
  };
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { message, error } = this.state;
    return (
      <div id='divheight'
        style={{
          float: "right",
          width: "95%",
          background: "#E5EEF0",
          height: "100vh",
          marginLeft: "60px",
        }}>
        <div style={{ marginTop: "30px", marginLeft: "60px" }}>
          <span className="main_header">ASSET DETAILS</span>

          <div className="underline" style={{ marginBottom: "30px" }}></div>
          <div style={{ display: "flex" }} className="myDIV"
            onClick={this.btnOption}>
            <button id="assetBtn"
              className="fancy-button active">
              Asset Tags
            </button>
            <button id="rackBtn"
              className="fancy-button ">
              Rack Details
            </button>
          </div>

          <div style={{ marginTop: "30px", display: "none" }} id="rackmonitor">
            <div className="inputdiv">
              <span className="label">Floor Name :</span>
              <select
                name="fname"
                id="fname"
                required="required"
                onChange={this.getTableDetails}
              />
            </div>
          </div>
          {error && (
            <div style={{ color: "red", marginTop: "20px" }}>
              <strong>{message}</strong>
            </div>
          )}
          <TableDetails />
        </div>

        {/* SessionOut Component used here!  */}
        <SessionOut />
      </div>
    );
  }
}
