import React, { Component } from 'react';
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import $ from "jquery";
import axios from 'axios';
import ApexCharts from 'react-apexcharts';
import TableScrollbar from 'react-table-scrollbar';
import './styles1.css';
import { SessionOut } from "./Common";

export default class CardHumiDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      message: "",
      rackid: '',
      assetid: '',
      series: [],
      series1: [],
      value: { min: 30, max: 80 },
    };
  }

  componentDidMount() {
    // this.getrackDetails();
    // this.chartData();
    // this.interval = setInterval(() => {
    //   this.getrackDetails();
    // }, 5 * 1000);
    // this.chartData();
    this.types();

    // this.getrackDetails();
    this.interval = setInterval(this.types, 15 * 1000);
  }
  types = () => {
    if ($('#filter').val() === 'Rack') {
      this.getrackDetails();
    } else {
      this.assetdetail();
    }
  }

  assetdetail = () => {
    console.log('asset===')
    this.setState({
      series: [],
      series1: []
    });
    $('#rackdetails').hide();
    $('#assetdetail').show();
    let datas = {
      from: 10,
      to: 30
    }
    axios({ method: 'POST', url: '/api/assetemp', data: datas })
      .then((response) => {
        console.log(response)
        let data = response.data;
        for (let i = 0; i < data.length; i++) {
          if (i === 0) {
            this.assetChartData(data[i].tagid);
          }
          let humiddiffer = data[i].humiditydiff;
          if (data[i].humiditydiff === null) {
            humiddiffer = 0;
          } else {
            humiddiffer = data[i].humiditydiff;
          }
          let humid = data[i].humidityf;
          if (data[i].humidityf === null) {
            humid = 0;
          } else {
            humid = data[i].humidityf;
          }
          let valNum =
            humiddiffer > 0
              ? "<td style='color: #26df2c;'>+" +
              humiddiffer +
              "  <span><i class='far fa-angle-up'></i></span></td>"
              : "<td style='color: #f00;'>" +
              humiddiffer +
              "  <span><i class='far fa-angle-down'></i></span></td>";

          let humidnum =
            humiddiffer > 0
              ? "<td style='color: #26df2c;font-weight: 500'>" + humid + "</td>"
              : "<td style='color: #f00;font-weight: 500;'>" + humid + "</td>";
          $("#asset_details").append(
            "<tr><td>" +
            (i + 1) +
            "</td>" +
            "<td>" +
            data[i].tagid +
            "</td>" +
            valNum +
            humidnum +
            "<td id=" +
            data[i].tagid +
            " style='font-size: 18px;cursor:pointer;color:#00629B'><span>" +
            "<i class='fas fa-info-circle'></i></span></td></tr>"
          );
          $("#" + data[i].tagid).on("click", () => this.assetChartData(data[i].tagid));
        }

      })
      .catch((error => {
        console.log(error)
        if (error.response.status === 403) {
          $("#displayModal").css("display", "block");
          // $("#content").text("User Session has timed out. Please Login again");
        }

      }))

  }

  getrackDetails = () => {
    this.setState({
      series: [],
      series1: []
    });
    $('#rackdetails').show();
    $('#assetdetail').hide();

    axios({ method: 'GET', url: '/api/racktemp' })
      .then((response) => {
        console.log(response)
        let data = response.data;
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            if (i === 0) {
              this.rackChartData(data[i].macid);
            }

            let humiddiffer = data[i].humiditydiff.toFixed(0);
            if (data[i].humiditydiff === null) {
              humiddiffer = 0;
            } else {
              humiddiffer = data[i].humiditydiff.toFixed(0);
            }
            let humid = data[i].humidity;
            if (data[i].humidity === null) {
              humid = 0;
            } else {
              humid = data[i].humidity;
            }
            let valNum =
              humiddiffer > 0
                ? "<td style='color: #26df2c;'>+" +
                humiddiffer +
                "  <span><i class='far fa-angle-up'></i></span></td>"
                : "<td style='color: #f00;'>" +
                humiddiffer +
                "  <span><i class='far fa-angle-down'></i></span></td>";

            let humidnum =
              humiddiffer > 0
                ? "<td style='color: #26df2c;font-weight: 500'>" + humid + "</td>"
                : "<td style='color: #f00;font-weight: 500;'>" + humid + "</td>";
            $("#rack_details").append(
              "<tr><td>" +
              (i + 1) +
              "</td>" +
              "<td>" +
              data[i].macid +
              "</td>" +
              valNum +
              humidnum +
              "<td id=" +
              data[i].macid +
              " style='font-size: 18px;cursor:pointer;color:#00629B'><span>" +
              "<i class='fas fa-info-circle'></i></span></td></tr>"
            );
            $("#" + data[i].macid).on("click", () => this.rackChartData(data[i].macid));
          }
        }
        else {
          this.setState({ error: true, message: 'No data Found' })
        }

      })
      .catch((error => {
        console.log(error)
        if (error.response.status === 403) {
          $("#displayModal").css("display", "block");
          // $("#content").text("User Session has timed out. Please Login again");
        }

      }))

  };

  rackChartData = (macid) => {
    this.setState({ rackid: macid })
    console.log(macid, '====================')
    this.setState({ message: "", error: false, success: false });
    this.setState({
      series: [],
      series1: []
    });
    let value = [];
    axios({ method: 'GET', url: '/api/rack/average?id=' + macid })
      .then((response) => {
        console.log(response)
        let data = response.data
        if (data.length !== 0) {


          for (let i = 0; i < data.length; i++) {
            let temp = data[i].avgHumidity;
            let chartDet = [];
            let time = data[i].lastseen;
            var date = new Date(time);
            var milliseconds = date.getTime();
            chartDet.push(milliseconds);
            chartDet.push(temp);
            value.push(chartDet);
          }
          this.setState({ series: [{ name: "Humidity", data: value }] });
        } else {
          this.setState({ error: true, message: 'No Data Found' })
        }
        // $("#assetMacid").text(macid)
      })
      .catch((error) => {
        console.log(error)
      })
  };

  assetChartData = (tagid) => {
    console.log(tagid, '====================')
    this.setState({ message: "", error: false, success: false });
    this.setState({
      assetid: tagid,

      series1: []
    });
    let value = [];
    axios({ method: "GET", url: "/api/track?id=" + tagid })
      .then((response) => {
        console.log(response)
        let data = response.data
        if (data.length > 0) {

          for (let i = 0; i < data.length; i++) {
            let temp = data[i].humidityf;
            let chartDet = [];
            let time = data[i].lastseen;
            var date = new Date(time);
            var milliseconds = date.getTime();
            chartDet.push(milliseconds);
            chartDet.push(temp);
            value.push(chartDet);
          }
          this.setState({ series1: [{ name: "Humidity", data: value }] });
        } else {
          this.setState({ error: true, message: 'No Data Found' })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  };


  componentWillUnmount() {
    clearInterval(this.interval);
  };
  sessionTimeout = () => {
    $("#displayModal").css("display", "none");
    sessionStorage.removeItem('isLogged')
    window.location.pathname = '/login'
  };

  render() {
    const { series, series1, assetid, rackid } = this.state;
    console.log("--------->", series);
    return (
      <div style={{
        float: "right", width: "95%",
        height: "100vh",
        // overflow: 'hidden',
        marginRight: '0px', background: '#E5EEF0',
        paddingBottom: "20px"
      }}>

        <div style={
          { marginTop: '30px', marginLeft: '60px', }}>
          <span className='main_header'>HUMIDITY</span>
          <div className='underline'></div>

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
                onChange={this.types}
              >
                <option >Rack</option>
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

          <div style={{ display: "flex" }} id='rackdetails'>
            <div className="box" style={{ height: "65vh", marginTop: '30px' }}>
              <TableScrollbar>
                <table
                >
                  <thead>
                    <tr>
                      <th>Sl.No</th>
                      <th>RackID</th>
                      <th colSpan="2">Humidity</th>
                      <th>Chart</th>
                    </tr>
                  </thead>
                  <tbody id="rack_details"></tbody>
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
                      {rackid}
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
                            colors: ["#008ffb"],
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
                          colors: ["#0000ff"],
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

          <div style={{ display: "flex" }} id="assetdetail">
            <div className="box" style={{ height: "65vh", marginTop: '30px' }}>
              <TableScrollbar>
                <table
                >
                  <thead>
                    <tr>
                      <th>Sl.No</th>
                      <th>AssetMacID</th>
                      <th colSpan="2">Humidity</th>
                      <th>Chart</th>
                    </tr>
                  </thead>
                  <tbody id="asset_details"></tbody>
                </table>
              </TableScrollbar>
            </div>

            <div
              style={{ marginLeft: "30px", width: "57%", marginTop: "30px" }}
            >
              {series1.length ? (
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
                    {assetid}
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
                          colors: ["#008FFB"],
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
                        colors: ["#0000ff"],
                      }}
                      series={series1}
                      type="area"
                      height={400}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {/* SessionOut Component used here!  */}
        <SessionOut />
      </div>
    )
  }
}
