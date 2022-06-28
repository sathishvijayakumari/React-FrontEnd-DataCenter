import React, { Component } from "react";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import $ from "jquery";
import axios from "axios";
import ApexCharts from "react-apexcharts";
import TableScrollbar from 'react-table-scrollbar';
import './styles1.css';
import { SessionOut } from "./Common";
import { racktemp, racktemp_chart, assettemp, assettemp_chart } from "../urls/api";

export default class CardTempDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      message: "",
      rackid: '',
      assetid: '',
      macId: "",
      series: [],
      value: { min: 30, max: 80 },
    };
  }

  componentDidMount() {
    this.tempDetails();
    this.interval = setInterval(this.tempDetails, 15 * 1000);
  }

  tempDetails = () => {
    this.setState({ error: false, message: "" });
    if ($("#filter").val() === "Rack") {
      axios({ method: "GET", url: racktemp })
        .then((response) => {
          const data = response.data;
          console.log("Rack Response====>", data);
          $("#table_det tbody").empty();
          $("#table_det thead").empty();
          if (data.length !== 0 && response.status === 200) {
            $("#table_det thead").append(
              "<tr>" +
              "<th>S.No</th>" +
              "<th>Rack ID</th>" +
              "<th colspan='2'>Temperature</th>" +
              "<th>Chart</th>" +
              "</tr>"
            );
            for (let i = 0; i < data.length; i++) {
              if (i === 0) {
                this.rackChartData(data[i].macid);
              }
              let tempdiffer = data[i].tempdiff.toFixed(0);
              if (data[i].tempdiff === null) {
                tempdiffer = 0;
              } else {
                tempdiffer = data[i].tempdiff.toFixed(0);
              }
              let temp = data[i].temp;
              if (data[i].temp === null) {
                temp = 0;
              } else {
                temp = data[i].temp.toFixed(0);
              }
              let valNum =
                tempdiffer >= 0
                  ? "<td style='color: #26df2c;'>+" +
                  tempdiffer +
                  "  <span><i class='far fa-angle-up'></i></span></td>"
                  : "<td style='color: #f00;'>" +
                  tempdiffer +
                  "  <span><i class='far fa-angle-down'></i></span></td>";

              let tempNum =
                tempdiffer >= 0
                  ? "<td style='color: #26df2c;font-weight: 500'>" + temp + "</td>"
                  : "<td style='color: #f00;font-weight: 500;'>" + temp + "</td>";
              $("#table_det tbody").append(
                "<tr><td>" +
                (i + 1) +
                "</td>" +
                "<td>" +
                data[i].macid +
                "</td>" +
                valNum +
                tempNum +
                "<td id=" +
                data[i].macid +
                " style='font-size: 18px;cursor:pointer;color:#00629B'><span>" +
                "<i class='fas fa-info-circle'></i></span></td></tr>"
              );
              $("#" + data[i].macid).on("click", () => this.rackChartData(data[i].macid));
            }

          } else {
            $('#divheight').css('height', '100vh')
            this.setState({ message: "No Rack data found!", error: true });
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
    } else if ($("#filter").val() === "Asset") {
      let datas = {
        from: 10,
        to: 30
      }
      axios({ method: "POST", url: assettemp, data: datas })
        .then((response) => {
          const data = response.data;
          console.log("Asset Response====>", data);
          $("#table_det tbody").empty();
          $("#table_det thead").empty();
          if (data.length !== 0 && response.status === 200) {
            $("#table_det thead").append(
              "<tr>" +
              "<th>S.No</th>" +
              "<th>Asset ID</th>" +
              "<th colspan='2'>Temperature</th>" +
              "<th>Chart</th>" +
              "</tr>"
            );
            for (let i = 0; i < data.length; i++) {
              if (i === 0) {
                this.assetChartData(data[i].tagid);
              }
              let tempdiffer = data[i].tempdiff;
              if (data[i].tempdiff === null) {
                tempdiffer = 0;
              } else {
                tempdiffer = data[i].tempdiff;
              }
              let temp = data[i].tempf;
              if (data[i].tempf === null) {
                temp = 0;
              } else {
                temp = data[i].tempf;
              }
              let valNum =
                tempdiffer > 0
                  ? "<td style='color: #26df2c;'>+" +
                  tempdiffer +
                  "  <span><i class='far fa-angle-up'></i></span></td>"
                  : "<td style='color: #f00;'>" +
                  tempdiffer +
                  "  <span><i class='far fa-angle-down'></i></span></td>";

              let tempNum =
                tempdiffer > 0
                  ? "<td style='color: #26df2c;font-weight: 500'>" + temp + "</td>"
                  : "<td style='color: #f00;font-weight: 500;'>" + temp + "</td>";
              $("#table_det tbody").append(
                "<tr><td>" +
                (i + 1) +
                "</td>" +
                "<td>" +
                data[i].tagid +
                "</td>" +
                valNum +
                tempNum +
                "<td id=" +
                data[i].tagid +
                " style='font-size: 18px;cursor:pointer;color:#00629B'><span>" +
                "<i class='fas fa-info-circle'></i></span></td></tr>"
              );
              $("#" + data[i].tagid).on("click", () => this.assetChartData(data[i].tagid));
            }

          } else {
            $('#divheight').css('height', '100vh')
            this.setState({ message: "No Rack data found!", error: true });
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
  }



  rackChartData = (macid) => {
    // var date1 = new Date();
    // var milliseconds1 = date1.getTime();
    this.setState({
      macId: macid, message: "", error: false,
      series: []
    });
    let value = [];
    axios({ method: 'GET', url: '/api/rack/average?id=' + macid })
      .then((response) => {
        console.log(response)
        let data = response.data
        if (data.length !== 0) {
          for (let i = 0; i < data.length; i++) {
            let temp = data[i].avgTemp;
            let chartDet = [];
            let time = data[i].lastseen;
            var date = new Date(time);
            var milliseconds = date.getTime();
            chartDet.push(milliseconds);
            chartDet.push(temp);
            value.push(chartDet);
          }
          this.setState({ series: [{ name: "Temperature", data: value }] });
        }
        else {
          this.setState({ error: true, message: 'No Rack Chart Data Found' })
        }

      })
      .catch((error) => {
        console.log(error)
        if (error.response.status === 403) {
          $("#displayModal").css("display", "block");
          $("#content").text("User Session has timed out. Please Login again");
        } else if (error.response.status === 404) {
          this.setState({
            error: true,
            message: "No Data Found.",
          },
            () => setTimeout(() => this.setState({ message: '' }), 5000));
        }
        else if (error.response.status === 400) {
          this.setState({
            error: true,
            message: "Request Failed.",
          },
            () => setTimeout(() => this.setState({ message: '' }), 5000));
        } else {
          this.setState({
            error: true,
            message: "Error occurred. Please try again.",
          },
            () => setTimeout(() => this.setState({ message: '' }), 5000));
        }
      })
  };

  assetChartData = (tagid) => {
    this.setState({ macId: tagid, message: "", error: false, series: [] });
    let value = [];
    axios({ method: "GET", url: "/api/track?id=" + tagid })
      .then((response) => {
        console.log(response)
        let data = response.data
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            let temp = data[i].tempf;
            let chartDet = [];
            let time = data[i].lastseen;
            var date = new Date(time);
            var milliseconds = date.getTime();
            chartDet.push(milliseconds);
            chartDet.push(temp);
            value.push(chartDet);
          }
          this.setState({ series: [{ name: "Temperature", data: value }] });
        }
        else {
          this.setState({ error: true, message: 'No  Data Found' })
        }
      })
      .catch((error) => {
        console.log(error)
        if (error.response.status === 403) {
          $("#displayModal").css("display", "block");
          $("#content").text("User Session has timed out. Please Login again");
        } else if (error.response.status === 404) {
          this.setState({
            error: true,
            message: "No Data Found.",
          },
            () => setTimeout(() => this.setState({ message: '' }), 5000));
        }
        else if (error.response.status === 400) {
          this.setState({
            error: true,
            message: "Request Failed.",
          },
            () => setTimeout(() => this.setState({ message: '' }), 5000));
        } else {
          this.setState({
            error: true,
            message: "Error occurred. Please try again.",
          },
            () => setTimeout(() => this.setState({ message: '' }), 5000));
        }
      })
  };


  componentWillUnmount() {
    clearInterval(this.interval);
  };

  render() {
    const { series, rackid, macId, error, message } = this.state;
    console.log("---------->", series);
    return (
      <div id
        style={{
          float: "right",
          width: "95%",
          height: "100vh",
          marginRight: "0px",
          background: "#E5EEF0",
          paddingBottom: "20px",
        }}
      >
        <div style={{ marginTop: "30px", marginLeft: "60px" }}>
          <span className="main_header">TEMPERATURE</span>
          <div className="underline"></div>

          <div style={{ display: "flex", marginTop: "30px" }}>
            <div className="inputdiv" style={{ position: "relative" }}>
              <input
                type="text"
                name="search"
                id="search"
                style={{ width: "175px", border: "1px solid #99d1dd" }}
                placeholder="5a-c2-15-00-00"
              />
              <i
                className="far fa-search"
                style={{
                  position: "absolute",
                  right: "11px",
                  top: "14px",
                  fontSize: "19px",
                  color: "#99d1dd",
                }}
              ></i>
            </div>

            <div className="inputdiv"
              style={{ marginLeft: "30px" }}
            >
              <select
                name="filter"
                id="filter"
                style={{ width: "175px", border: "1px solid #99d1dd" }}
                onChange={this.tempDetails}
              >
                <option>Rack</option>
                <option>Asset</option>
              </select>
            </div>

            <div style={{ margin: "13px 30px", width: "175px" }}>
              <InputRange
                minValue={0}
                maxValue={100}
                onChange={(value) => this.setState({ value })}
                value={this.state.value}
              />
            </div>
          </div>

          {error && (
            <div style={{ color: 'red', marginTop: '20px' }}>
              <strong>{message}</strong>
            </div>
          )}
          <div style={{ display: "flex" }} id='temp_details'>
            <div className="box" style={{ height: "65vh", marginTop: '30px' }}>
              <TableScrollbar>
                <table style={{ width: "95%" }} id="table_det">
                  <thead></thead>
                  <tbody></tbody>
                </table>
              </TableScrollbar>
            </div>
            <div
              style={{ marginLeft: "30px", width: "57%", marginTop: "30px" }}
            >

              {series.length ? (
                <div>
                  <div
                    id="chart"
                    style={{
                      borderRadius: "10px",
                      backgroundColor: "#FFF",
                      height: "68vh",
                    }}
                  >
                    <div
                      style={{
                        padding: "15px",
                        fontSize: "17px",
                        color: "#00629b",
                      }}
                    >
                      <b>Mac ID : {macId}</b>
                    </div>

                    <div id="chart-timeline">
                      <ApexCharts
                        options={{
                          chart: {
                            id: "area-datetime",
                            type: "area",
                            height: 450,
                            foreColor: "#004d99",
                            curve: "smooth",
                            zoom: {
                              autoScaleYaxis: true,
                            },
                            animations: {
                              enabled: true,
                              easing: "easeinout",
                              speed: 1500,
                              animateGradually: {
                                enabled: true,
                                delay: 1500,
                              },
                              dynamicAnimation: {
                                enabled: true,
                                speed: 1500,
                              },
                            },
                          },
                          stroke: {
                            width: 2,
                          },
                          dataLabels: {
                            enabled: false,
                          },
                          markers: {
                            size: 0,
                          },
                          xaxis: {
                            type: "datetime",
                            tickAmount: 1,
                            labels: {
                              datetimeUTC: false,
                            },
                          },
                          yaxis: {
                            labels: {
                              formatter: function (value) {
                                return value.toFixed(0);
                              },
                            },
                          },
                          tooltip: {
                            x: {
                              format: "yyyy-MM-dd HH:mm:ss",
                            },
                          },
                          fill: {
                            type: "gradient",
                            gradient: {
                              shadeIntensity: 1,
                              opacityFrom: 0.2,
                              opacityTo: 0.9,
                            },
                          },
                          colors: ["#F44336"],
                        }}
                        series={series}
                        type="area"
                        height={400}
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* SessionOut Component used here!  */}
        <SessionOut />
      </div>
    );
  }
}
