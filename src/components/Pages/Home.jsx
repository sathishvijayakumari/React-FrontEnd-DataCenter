/* eslint-disable import/no-anonymous-default-export */
import React, { Component } from 'react'
import Speedometer from "react-d3-speedometer";
import Chart from 'react-apexcharts'
import ApexCharts from 'react-apexcharts';
import axios from 'axios';
import $ from "jquery";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      message: '',
      temp: 0,
      humid: 0,
      energy: 0,
      occupancy: 0,
      assetCount: 0,
      capacity: [],
      series: [],
      series1: [],
      options: {
        chart: {
          id: 'area-datetime',
          type: 'area',
          height: 330,
          zoom: {
            autoScaleYaxis: true
          }
        },
        stroke: {
          width: 2,
        },
        dataLabels: {
          enabled: false,

        },
        markers: {
          size: 0,
          color: ["#ff6600"],
        },
        xaxis: {
          type: 'datetime',
          labels: {
            datetimeUTC: false,
          },
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return value.toFixed(2) + ""

            },
          },
        },
        tooltip: {
          x: {
            format: 'yyyy-MM-dd HH:mm:ss'
          }
        }, fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.2,
            opacityTo: 0.9,
          },
        },
        colors: ['#ff6600'],
      },

    };
  }
  componentDidMount() {
    this.systemStatus();
  }

  systemStatus = () => {
    this.setState({ series: [5, 10], series1: [] });
    this.alertHistory();
    axios({ method: 'GET', url: '/api/systemstatus' })
      .then((response) => {
        console.log("Home response---->", response);
        let data = response.data;
        this.setState({
          temp: data.temp, humid: data.humidity,
          energy: data.energy, assetCount: data.asset_count,
          occupancy: ((data.asset_count / data.rack_capacity) * 100).toFixed(2),
          capacity: [data.asset_count, data.rack_capacity - data.asset_count]
        })
      })
      .catch((error) => {
        if (error.response.status === 403) {
          $("#displayModal").css("display", "block");
          $("#content").text("User Session has timed out. Please Login again");
        } else if (error.response.status === 400) {
          this.setState({ error: true, message: 'Bad Request!' })
        } else if (error.response.status === 404) {
          this.setState({ error: true, message: 'No data Found!' })
        }
      })
  }
  alertHistory = () => {
    $("#tempalert").empty();
    axios({ method: "GET", url: "/api/alert?value=" + 8 })
      .then((response) => {
        console.log(response, 'templert======');
        let data = response.data;
        if (response.status === 200 && data.length !== 0) {
          let value = [];
          for (let i = 1; i < data.length; i++) {
            let time = data[i].lastseen.replace("T", " ").substr(0, 19);
            var date = new Date(time);
            var milliseconds = date.getTime();
            value.push([milliseconds, data[i].temperature]);
          }
          this.setState({ series1: [{ name: "Temperature", data: value }] });
        } else {
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

  sessionTimeout = () => {
    $("#displayModal").css("display", "none");
    sessionStorage.removeItem('isLogged')
    window.location.pathname = '/login'
  };

  render() {
    const { series, occupancy, series1, temp, humid, energy, capacity, assetCount } = this.state;
    console.log("render")
    return (
      <>
        <div style={{ float: "right", width: "95%", marginRight: '0px', background: '#E5EEF0', height: '100vh' }}>
          <div style={{ marginTop: '30px', display: 'flex', marginLeft: '60px', justifyContent: 'space-between', width: '93%' }}>
            <div className='cards' style={{ cursor: 'pointer' }}
              onClick={() => {
                window.location.pathname = "/cardtempdet"
              }}
            >
              <Speedometer
                width={202}
                height={138}
                labelFontSize="12"
                valueTextFontSize="15"
                needleHeightRatio={0.6}
                ringWidth={25}
                segments={450}
                value={temp}
                minValue={0}
                maxValue={100}
                startColor="green"
                endColor="red"
                maxSegmentLabels={5}
                needleColor="#cc0066"
              />
              <span className='card_text'>Max Temperature</span><br />
              <span style={{ paddingTop: '8px', color: '#F15009', fontWeight: 600, fontSize: '21px' }}>{temp + '°C'}</span>
            </div>

            <div className='cards' style={{ cursor: 'pointer' }}
              onClick={() => {
                window.location.pathname = "/cardhumidet"
              }}
            >
              <Speedometer
                width={202}
                height={138}
                labelFontSize="12"
                valueTextFontSize="15"
                needleHeightRatio={0.6}
                ringWidth={25}
                segments={450}
                value={humid}
                minValue={0}
                maxValue={200}
                startColor="#d9d9ff"
                endColor="#0000ff"
                maxSegmentLabels={5}
                needleColor="#0000ff"
              />
              <span className='card_text'>Max Humidity</span><br />
              <span style={{ paddingTop: '8px', color: '#0000ff', fontWeight: 600, fontSize: '21px' }}>{humid + 'RH'}</span>
            </div>

            <div className='cards'
              style={{ cursor: 'pointer' }}
              onClick={() => {
                window.location.pathname = "/cardenergydet"
              }}
            >
              <Speedometer
                width={202}
                height={138}
                labelFontSize="12"
                valueTextFontSize="15"
                needleHeightRatio={0.6}
                ringWidth={25}
                segments={450}
                value={energy}
                minValue={0}
                maxValue={200}
                startColor="#FCD9B2"
                endColor="#ff6600"
                maxSegmentLabels={5}
                needleColor="#ff6600"
              />
              <span className='card_text'>Energy Usage</span><br />
              <span style={{
                paddingTop: '8px', color: '#ff6600',
                fontWeight: 600, fontSize: '21px'
              }}>{energy + 'kWh'} </span>
            </div>
            <div className='cards' >
              <div style={{ marginLeft: '8px' }}>
                {capacity.length > 0 ?
                  <Chart series={capacity}
                    options={{
                      labels: [
                        'Occupied', 'Available'
                      ],
                      legend: {
                        show: false,
                        position: 'bottom',
                        offsetX: 20
                      },
                      dataLabels: {
                        enabled: false
                      },
                      colors: [
                        '#a64dff', '#d9b3ff'
                      ],
                      plotOptions: {
                        pie: {
                          donut: {
                            labels: {
                              show: true,
                              name: {
                                show: true,
                                offsetY: -6,
                              },
                              total: {
                                show: false,
                                label: '',
                                // formatter: () => assetCount
                              },
                              tooltip: {
                                enabled: false,
                              }
                            }
                          }
                        }
                      },
                    }}

                    type="donut"
                    width="200"
                  // height="340"
                  /> : <p></p>}
              </div>
              <span className='card_text'>Server Occupancy</span><br />
              <span style={{ paddingTop: '8px', color: '#a64dff', fontWeight: 600, fontSize: '21px' }}>
                {occupancy}%
              </span>
            </div>
            <div className='cards'>
              <img src="/images/ghostserver.png" alt=""
                style={{ width: '105px', marginBottom: '13px', marginLeft: '25px' }} />
              <br />
              <span className='card_text'>Ghost Servers</span><br />
              <span style={{
                paddingTop: '8px', color: '#FF7676',
                fontWeight: 600, fontSize: '21px'
              }}>3</span>
            </div>
          </div>


          <div style={{ display: 'flex', width: '93%', marginLeft: '60px', marginTop: '30px' }}>
            <div className='sensors_div'
              style={{
                boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.65)', background: 'white', width: '450px', height: '340px',
                borderRadius: '8px', textAlign: 'center'
              }}
            >
              <p style={{
                fontSize: '21px', marginTop: '10px',
                fontWeight: 600, color: '#5C5B5B', marginBottom: '14px',
                fontFamily: 'poppins-Regular'
              }}>Total senors Installed</p>

              <div
                style={{
                  width: '375px', marginRight: 'auto', marginLeft: 'auto', borderRadius: '8px',
                  border: '1px solid #00629B', height: '78px', marginBottom: '10px'
                }}
              >
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.25)'
                }}>
                  <img src="/images/asset.svg" alt="" style={{ width: '95px' }} />
                  <span className='sensor_tagtext'>
                    Asset Tag</span>
                  <span className='sensor_tagcount'>{assetCount}</span>
                </div>
              </div>

              <div className='sensors_div'
                style={{
                  width: '375px', boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.25)',
                  marginRight: 'auto', marginLeft: 'auto',
                  borderRadius: '8px', border: '1px solid #00629B',
                  height: '78px', marginBottom: '10px'
                }}
              >
                <div style={{
                  display: 'flex', justifyContent: 'space-between'
                }}>
                  <img src="/images/energy.svg" alt="" style={{ width: '95px' }} />
                  <span className='sensor_tagtext'>
                    Energy Tag</span>
                  <span className='sensor_tagcount'>{assetCount}</span>
                </div>
              </div>

              <div className='sensors_div'
                style={{
                  width: '375px', boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.25)', marginRight: 'auto',
                  marginLeft: 'auto', borderRadius: '8px', border: '1px solid #00629B',
                  height: '78px', marginBottom: '10px'
                }}
              >
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                }}>
                  <div style={{ width: '95px', overflow: 'hidden', }}>
                    <img src="/images/thsensor.svg" alt="" style={{ height: '90px' }} />
                  </div>
                  <span className='sensor_tagtext'>
                    T-H Sensors</span>
                  <span className='sensor_tagcount'>{assetCount}</span>
                </div>
              </div>
            </div>

            <div style={{ width: '710px', height: '340px', background: 'white', marginLeft: '28px', borderRadius: '8px', boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.65)', textAlign: 'center' }}>
              <p style={{ fontSize: '21px', marginTop: '10px', fontWeight: 600, color: '#5C5B5B', marginBottom: '14px', fontFamily: 'poppins-Regular' }}>Alerts History</p>

              <div style={{ marginLeft: '40px' }}>
                <ApexCharts options={
                  this.state.options
                }
                  series={series1}
                  type="area"
                  width={620}
                  height={280} />
              </div>
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
      </>
    )
  }
}
