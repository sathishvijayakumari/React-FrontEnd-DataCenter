import React, { Component } from "react";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import $ from "jquery";
import Chart from "react-apexcharts";
import axios from "axios";
import ApexCharts from "react-apexcharts";

export default class CardTempDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      message: "",
      series: [],
      value: { min: 30, max: 80 },
      tableData: [
        {
          sno: 1,
          rackid: "5a-c2-15-00-00-01",
          val: 2,
          temp: 35,
          timestamp: "2022-05-17 12:48:00",
        },
        {
          sno: 2,
          rackid: "5a-c2-15-00-00-02",
          val: 2,
          temp: 35,
          timestamp: "2022-05-17 12:48:00",
        },
        {
          sno: 3,
          rackid: "5a-c2-15-00-00-03",
          val: 2,
          temp: 35,
          timestamp: "2022-05-17 12:48:00",
        },
        {
          sno: 4,
          rackid: "5a-c2-15-00-00-04",
          val: 2,
          temp: 35,
          timestamp: "2022-05-17 12:48:00",
        },
        {
          sno: 5,
          rackid: "5a-c2-15-00-00-05",
          val: 2,
          temp: 35,
          timestamp: "2022-05-17 12:48:00",
        },
        {
          sno: 6,
          rackid: "5a-c2-15-00-00-06",
          val: 2,
          temp: 35,
          timestamp: "2022-05-17 12:48:00",
        },
        {
          sno: 7,
          rackid: "5a-c2-15-00-00-07",
          val: 2,
          temp: 35,
          timestamp: "2022-05-17 12:48:00",
        },
        {
          sno: 8,
          rackid: "5a-c2-15-00-00-08",
          val: 2,
          temp: 35,
          timestamp: "2022-05-17 12:48:00",
        },
        {
          sno: 9,
          rackid: "5a-c2-15-00-00-09",
          val: 2,
          temp: 35,
          timestamp: "2022-05-17 12:48:00",
        },
        {
          sno: 10,
          rackid: "5a-c2-15-00-00-0a",
          val: 2,
          temp: 35,
          timestamp: "2022-05-17 12:48:00",
        },
        {
          sno: 11,
          rackid: "5a-c2-15-00-00-0b",
          val: 2,
          temp: 35,
          timestamp: "2022-05-17 12:48:00",
        },
        {
          sno: 12,
          rackid: "5a-c2-15-00-00-0c",
          val: 2,
          temp: 35,
          timestamp: "2022-05-17 12:48:00",
        },
        {
          sno: 13,
          rackid: "5a-c2-15-00-00-0d",
          val: 2,
          temp: 35,
          timestamp: "2022-05-17 12:48:00",
        },
        {
          sno: 14,
          rackid: "5a-c2-15-00-00-0e",
          val: 2,
          temp: 35,
          timestamp: "2022-05-17 12:48:00",
        },
      ],
    };
  }

  componentDidMount() {
    this.getDetails();
    this.chartData();
    this.interval = setInterval(() => {
      this.getDetails();
    }, 5 * 1000);
  }

  getDetails = () => {
    // let data = this.state.tableData;
    // $("#temp_details").empty();
    // for (let i = 0; i < 14; i++) {
    //   let randno = Math.floor(Math.random() * (9 - -5)) + -5;
    //   let tem = Math.floor(Math.random() * (65 - 23)) + 23;

    //   let valNum =
    //     randno > 0
    //       ? "<td style='color: #26df2c;'>+" +
    //         randno +
    //         "  <span><i class='far fa-angle-up'></i></span></td>"
    //       : "<td style='color: #f00;'>" +
    //         randno +
    //         "  <span><i class='far fa-angle-down'></i></span></td>";

    //   let tempNum =
    //     randno > 0
    //       ? "<td style='color: #26df2c;font-weight: 500'>" + tem + "</td>"
    //       : "<td style='color: #f00;font-weight: 500;'>" + tem + "</td>";

    //   $("#temp_details").append(
    //     "<tr><td>" +
    //       data[i].sno +
    //       "</td>" +
    //       "<td>" +
    //       data[i].rackid +
    //       "</td>" +
    //       valNum +
    //       tempNum +
    //       "<td id=" +
    //       data[i].rackid +
    //       " style='font-size: 18px;cursor:pointer'><span>" +
    //       "<i class='fas fa-info-circle'></i></span></td></tr>"
    //   );
    //   $("#" + data[i].rackid).on("click", () => this.chartData(data[i].rackid));
    // }

    axios({method:'GET',url:'/api/racktemp'})
    .then((response)=>{
      console.log(response)
      let data=response.data;
      for(let i=0;i<data.length;i++){
        $("#temp_details").append(
              "<tr><td>" +
               (i+1) +
                "</td>" +
                "<td>" +
                data[i].macid +
                "</td>" +
                "<td>" +
                data[i].temp +
                "</td>" +
                "<td>" +
                data[i].temp +
                "</td>" +
                "<td id=" +
                data[i].macid +
                " style='font-size: 18px;cursor:pointer'><span>" +
                "<i class='fas fa-info-circle'></i></span></td></tr>"
            );
            $("#" + data[i].macid).on("click", () => this.chartData(data[i].macid));
      }

    })
    .catch((error=>{
      console.log(error)
    }))

  };

  chartData = () => {
    this.setState({ message: "", error: false, success: false });
    this.setState({ series: [] });
    let value = [];
    for (let i = 1; i < 5; i++) {
      let tem = Math.floor(Math.random() * (65 - 23)) + 23;
      let chartDet = [];
      let time = "2022-05-17 10:0" + i + ":00";
      var date = new Date(time);
      var milliseconds = date.getTime();
      chartDet.push(milliseconds);
      chartDet.push(tem);
      value.push(chartDet);
    }
    this.setState({ series: [{ name: "Temperature", data: value }] });
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { series } = this.state;
    console.log("--------->", series);
    return (
      <div
        style={{
          float: "right",
          width: "95%",
          height: "100vh",
          overflow: "hidden",
          marginRight: "0px",
          background: "#E5EEF0",
          paddingBottom: "20px",
        }}
      >
        <div style={{ marginTop: "30px", marginLeft: "60px" }}>
          <span className="main_header">TEMPERATURE</span>
          <div className="underline"></div>
          <div style={{ display: "flex", marginTop: "30px" }}>
           {/*<div className="inputdiv" style={{ position: "relative" }}>
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
            */} 

            <div className="inputdiv" 
            // style={{ marginLeft: "30px" }}
            >
              <select
                name="filter"
                id="filter"
                style={{ width: "175px", border: "1px solid #99d1dd" }}
              >
                <option value="rack">Rack</option>
                <option value="asset">Asset</option>
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

          {/* <div>
            <table>
              <thead>
                <tr>
                  <th>Sl.No</th>
                  <th>RackID</th>
                  <th style={{marginLeft:"300px", width:"200px", backgroundColor:"#f00"}}>Temperature</th>
                  <th>Chart</th>
                </tr>
              </thead>
              <tbody id="temp_details"></tbody>
            </table>
            </div> */}

          <div style={{ display: "flex" }}>
            <table
              style={{
                marginTop: "30px",
                width: "40%",
              }}
            >
              <thead>
                <tr>
                  <th>Sl.No</th>
                  <th>RackID</th>
                  <th colSpan="2">Temperature</th>
                  <th>Chart</th>
                </tr>
              </thead>
              <tbody id="temp_details"></tbody>
            </table>

            <div
              style={{ marginLeft: "30px", width: "57%", marginTop: "30px" }}
            >
              {series.length ? (
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
                    RackID : 5a-c2-15-00-00-00
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
                        colors: ["#F44336"],
                      }}
                      series={series}
                      type="area"
                      height={400}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
