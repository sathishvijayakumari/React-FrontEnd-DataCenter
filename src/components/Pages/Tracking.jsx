import React, { Component } from 'react'
import axios from "axios";
import $ from "jquery";
import RackTempAnimation from './RackTempAnimation';
import ApexCharts from 'react-apexcharts';
import "./radiobutton.css";
import { linkClicked } from '../sidebar/Leftsidebar';

const option = {
    chart: {
        id: 'area-datetime',
        type: 'area',
        height: 450,
        foreColor: "#004d99",
        curve: 'smooth',
        zoom: {
            autoScaleYaxis: true
        },
        animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 500,
            animateGradually: {
                enabled: true,
                delay: 500
            },
            dynamicAnimation: {
                enabled: true,
                speed: 500
            }
        }
    },
    stroke: {
        width: 2,
    },
    dataLabels: {
        enabled: false,
    },
    xaxis: {
        type: 'datetime',
        tickAmount: 1,
        labels: {
            datetimeUTC: false,
        }
    },
    tooltip: {
        x: {
            format: 'yyyy-MM-dd HH:mm:ss'
        }
    },
    // colors: ['#ff0000', "#3333ff"],
}
export default class RealTimeTracking1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            display: "",
            error: false,
            loading: false,
            rackID: "",
            assetID: "",
            series: [],
            animateData: [],
        };
    }

    componentDidMount() {
        linkClicked(2);
        axios({
            method: "GET",
            url: "/api/uploadmap",
            headers: {
                "content-type": "multipart/form-data",
            },
        })
            .then((response) => {
                console.log("=======>", response);
                if (response.status === 201 || response.status === 200) {
                    this.fdata = response.data;
                    if (this.fdata.length !== 0) {
                        $("#floorBlock").css("display", "block");
                        for (let i = 0; i < this.fdata.length; i++) {
                            $("#fname").append(
                                "<option value=" + i + ">" + this.fdata[i].name + "</option>"
                            );
                        }
                        this.floorData = response.data;
                        this.plotFloorMap();
                    } else {
                        this.setState({ error: true, message: "Please upload a floormap." })
                    }
                } else {
                    this.setState({ error: true, message: "Unable to get Floor Map." })
                }
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
            });
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    plotFloorMap = () => {
        this.setState({ error: false, message: "" })
        let floorID = $("#fname").val();
        this.fimage = this.floorData[floorID];
        this.fWidth = this.fimage.width;
        this.fHeight = this.fimage.height;
        $("#tempimg").attr("src", "../images/Rack_Sensing.png");
        $("#tempimg").attr("style", "width:auto;height:auto;");
        $("#lastupdated").css("display", "none");
        $("#temp").children("div").remove();
        $("#temp .sensors").remove();
        this.timeout = setTimeout(() => {
            this.rackMonitor();
        }, 1 * 1000);
        // this.rackMonitor();
    };

    rackMonitor = () => {
        let floorID = $("#fname").val();
        this.setState({ error: false, message: "", rackID: "" })
        this.wp = document.getElementById("temp").clientWidth;
        this.hp = document.getElementById("temp").clientHeight;
        axios({
            method: "GET",
            url: "/api/rack/monitor?floorid=" + this.floorData[floorID].id,
        })
            .then((response) => {
                if (response.status === 200 || response.status === 201) {
                    let wpx = this.wp / this.fWidth;
                    let hpx = this.hp / this.fHeight;
                    console.log("response=====>", response);
                    if (response.data.length !== 0) {
                        let data = response.data.asset;
                        // $("#tempimg").attr(
                        //     "style",
                        //     "width:" + this.wp + "px;height:" + this.hp + "px;"
                        // );
                        for (let i = 0; i < data.length; i++) {
                            let xaxis = 0, yaxis = 0;
                            xaxis = parseInt(wpx * parseFloat(data[i].x));
                            yaxis = parseInt(hpx * parseFloat(data[i].y));
                            let width = Math.ceil((data[i].x1 - data[i].x) * wpx);
                            let height = Math.ceil((data[i].y1 - data[i].y) * hpx);
                            let childDiv1 = document.createElement("div");
                            $(childDiv1).attr("id", data[i].rack);
                            $(childDiv1).attr("class", "rack");
                            $(childDiv1).attr("title", "RackID: " + data[i].rack +
                                "\nCapacity : " + data[i].capacity + "\nNo.of Assets : " + data[i].count +
                                "\nAvailable U's: " + data[i].available + "\nUtilization : " + data[i].usage + "%");
                            $(childDiv1).attr(
                                "style",
                                "border:0.4px solid black;background:rgba(5,247, 35, 0.5);" +
                                "position: absolute; cursor: pointer; left:" +
                                xaxis + "px; top:" + yaxis + "px;" +
                                "width:" + width + "px;height:" + height + "px;"
                            );
                            $(childDiv1).on('click', () => this.animation(data[i].rack, "show"))
                            $("#temp").append(childDiv1);
                        }
                    }
                }
            })
            .catch((error) => {
                console.log("error===>", error);
                if (error.response.status === 403) {
                    $("#displayModal").css("display", "block");
                    $("#content").text("User Session has timed out. Please Login again");
                } else if (error.response.status === 400) {
                    this.setState({ error: true, message: 'Bad Request!' })
                } else if (error.response.status === 404) {
                    this.setState({ error: true, message: 'No data Found!' })
                }
            });
    };

    animation = (rackId, status) => {
        this.setState({ rackID: rackId, assetID: "", display: "asset" });
        this.tableSlideAnimate("hide");
        $("#img_container .assets").remove();
        $("input[name=rack]").val(['asset']);
        if (status === "show") {
            $("#screen").animate({ "right": "0px" }, "slow");
            // this.assetData(rackId);
            this.radioBtnChange(rackId);
        } else if (status === "hide") {
            $("#screen").animate({ "right": "-70vw" }, "slow");
        }
    }

    assetData = (rackId) => {
        console.log("rackId---->", rackId);
        $("#rackImg").attr("src", "../images/mainframe.png");
        $("#rackImg").css({ "width": "200px", "height": "522px" });
        let incValue = 0;
        for (let i = 42; i >= 1; i--) {
            let assetDiv = document.createElement("div");
            $(assetDiv).attr("id", "asset_" + i);
            $(assetDiv).attr("class", "assets");
            $(assetDiv).css({
                "width": "175px",
                "height": "9px",
                "position": "absolute",
                "background": "rgba(16,255,0,0.6)",
                "left": "12px",
                "top": (13 + incValue).toString() + "px",
            });
            $("#img_container").append(assetDiv);
            incValue += 12;
        }

        axios({ method: "GET", url: "/api/asset/racktracking?rackid=" + rackId })
            .then((response) => {
                console.log('assetdata=====', response)
                if (response.status === 200 || response.status === 201) {
                    let data = response.data.asset;
                    if (data.length !== 0) {
                        console.log("assetView =====>", response);
                        $('#assetcapacity').text(response.data.rackcapacity);
                        $('#assetcount').text(response.data.assetcount);
                        $('#assetuse').text(response.data.available)
                        for (let i = 0; i < data.length; i++) {
                            // high temperature based descending order and calling 
                            if (i === 0) {
                                this.assetServerDetails(data[i].tagid);
                            }
                            $("#asset_" + data[i].location).css({
                                "background": "rgba(255,35,0,0.6)",
                                "cursor": "pointer"
                            });
                            $("#asset_" + data[i].location).attr("title",
                                "AssetID : " + data[i].tagid +
                                "\nLocation : " + data[i].location +
                                "\nLastSeen : " + data[i].lastseen.substring(0, 19).replace("T", " "));
                            $("#asset_" + data[i].location).on("click", () => {
                                this.assetServerDetails(data[i].tagid)
                            })
                        }
                    }
                }
            })
            .catch((error) => {
                console.log("------>", error);
                if (error.response.status === 403) {
                    $("#displayModal").css("display", "block");
                    $("#content").text("User Session has timed out. Please Login again");
                }
            })
    }

    assetServerDetails = (assetId) => {
        this.setState({ assetID: assetId });
        this.setState({ series: [] })
        // this.setState({ error:false, message:''});
        console.log("assetServerDetails()----->", assetId);
        // let value = [], humidity = [];
        // for (let i = 10; i < 60; i++) {
        //     let tem = Math.floor(Math.random() * (45 - (23))) + (23);
        //     let humi = Math.floor(Math.random() * (60 - (17))) + (17);
        //     let chartDet = [], humiData = [];
        //     let time = "2022-05-17 10:" + i + ":00";
        //     var date = new Date(time);
        //     var milliseconds = date.getTime();
        //     chartDet.push(milliseconds);
        //     chartDet.push(tem)
        //     value.push(chartDet);

        //     humiData.push(milliseconds);
        //     humiData.push(humi)
        //     humidity.push(humiData);
        // }
        // this.setState({
        //     series: [{ name: 'Temperature', data: value },
        //     { name: 'Humidity', data: humidity }]
        // })

        axios({ method: 'GET', url: "/api/track?id=" + assetId })
            .then((response) => {
                this.setState({ error: false, message: '' })
                console.log("Responseassetdetsgraphh====>", response);
                let data = response.data;
                if (response.status === 200 || response.status === 201) {
                    if (data.length !== 0) {
                        let util = [], tempF = [], tempB = [], humiF = [], humiB = [], power = [], energy = [];
                        for (let i = 0; i < data.length; i++) {
                            let time = data[i].lastseen.substring(0, 19).replace("T", " ");
                            var date = new Date(time);
                            var ms = date.getTime();
                            util.push([ms, data[i].utilisation]);
                            tempF.push([ms, data[i].tempf]);
                            tempB.push([ms, data[i].tempb]);
                            humiF.push([ms, data[i].humidityf]);
                            humiB.push([ms, data[i].humidityb]);
                            power.push([ms, data[i].energy]);
                            energy.push([ms, data[i].power]);
                        }
                        this.setState({
                            series: [
                                { name: 'Utilization (%)', data: util },
                                { name: 'Temp (F)', data: tempF },
                                { name: 'Temp (B)', data: tempB },
                                { name: 'Humidity (F)', data: humiF },
                                { name: 'Humidity (B)', data: humiB }
                            ],
                            // series: [
                            //     { name: 'Power (Actual)', data: power },
                            //     { name: 'Power* (Ideal)', data: energy }
                            // ]
                        });
                    } else {
                        $('#nodata').show();
                        // this.setState({ error: true, message: 'No data Found!' })
                    }
                }

            })
            .catch((error) => {
                console.log("ERROR---->", error);
                if (error.response.status === 403) {
                    $("#displayModal").css("display", "block");
                    $("#content").text("User Session has timed out. Please Login again");
                }
            })
    }

    thermalData = (rackId) => {
        this.setState({ error: false, message: "" });
        $("#rackImg").attr("src", "../images/Thermal.png");
        $("#rackImg").css({ "width": "390px", "height": "548px" });
        let incValue = 0;
        for (let i = 42; i >= 1; i--) {
            let assetFront = document.createElement("div");
            $(assetFront).attr("id", "asset_front" + i);
            $(assetFront).attr("class", "assets");
            $(assetFront).css({
                "width": "175px",
                "height": "9px",
                "position": "absolute",
                // "background": "rgba(0,255,0,0.5)",
                "left": "12px",
                "top": (39 + incValue).toString() + "px",
            });
            $("#img_container").append(assetFront);

            let assetBack = document.createElement("div");
            $(assetBack).attr("id", "asset_back" + i);
            $(assetBack).attr("class", "assets");
            $(assetBack).css({
                "width": "175px",
                "height": "9px",
                "position": "absolute",
                // "background": "rgba(0,255,0,0.5)",
                "left": "202px",
                "top": (39 + incValue).toString() + "px",
            });
            $("#img_container").append(assetBack);
            incValue += 12;
        }
        axios({ method: "GET", url: "/api/thermal/racktracking?rackid=" + rackId })
            .then((response) => {
                console.log("thermaldata =====>", response);
                if (response.status === 200 || response.status === 201) {
                    let data = response.data.thermal;
                    let data1 = response.data;
                    if (data.length !== 0) {
                        for (let i = 0; i < data.length; i++) {
                            if (i === 0) {
                                this.setState({ animateData: [data1.avgtemp, data1.mintemp, data1.maxtemp] })
                                // high temperature based descending order and calling 
                                this.thermalServerDet("front", data[i].tagid);
                            }
                            let temp_front = data[i].tempf;
                            let temp_back = data[i].tempb;
                            let frontClr = "", backClr = "";
                            if (temp_front <= 20) frontClr = "rgba(16,250,0,0.6)";
                            else if (temp_front >= 21 && temp_front <= 25) frontClr = "rgba(128,204,0,0.6)";
                            else if (temp_front >= 26 && temp_front <= 30) frontClr = "rgba(255,194,0,0.6)";
                            else if (temp_front >= 31 && temp_front <= 35) frontClr = "rgba(255,125,0,0.6)";
                            else if (temp_front > 35) frontClr = "rgba(255,35,0,0.6)";

                            if (temp_back <= 20) backClr = "rgba(16,250,0,0.6)";
                            else if (temp_back >= 21 && temp_back <= 25) backClr = "rgba(128,204,0,0.6)";
                            else if (temp_back >= 26 && temp_back <= 30) backClr = "rgba(255,194,0,0.6)";
                            else if (temp_back >= 31 && temp_back <= 35) backClr = "rgba(255,125,0,0.6)";
                            else if (temp_back > 35) backClr = "rgba(255,35,0,0.6)";

                            $("#asset_front" + data[i].location).css({
                                "background": frontClr,
                                "cursor": "pointer"
                            });
                            $("#asset_front" + data[i].location).attr("title",
                                "AssetID : " + data[i].tagid +
                                "\nTemperature : " + data[i].tempf +
                                "\nLastSeen : " + data[i].lastseen.substring(0, 19).replace("T", " "));
                            $("#asset_front" + data[i].location).on("click", () => {
                                this.thermalServerDet("front", data[i].tagid)
                            })

                            $("#asset_back" + data[i].location).css({
                                "background": backClr,
                                "cursor": "pointer"
                            });
                            $("#asset_back" + data[i].location).attr("title",
                                "AssetID : " + data[i].tagid +
                                "\nTemperature : " + data[i].tempb +
                                "\nLastSeen : " + data[i].lastseen.substring(0, 19).replace("T", " "));
                            $("#asset_back" + data[i].location).on("click", () => {
                                this.thermalServerDet("back", data[i].tagid)
                            })
                        }
                    }
                }
            })
            .catch((error) => {
                console.log("ERROR===>", error);
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

    thermalServerDet = (side, assetId) => {
        this.setState({ assetID: assetId });
        this.setState({ series: [] })
        console.log("thermalServerDet()----->", assetId);
        axios({
            method: "POST",
            url: "/api/asset/history",
            data: { id: assetId, value: side }
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log("tempgraph Data======>", response);
                    let data = response.data;
                    let temp = [], humidity = [];
                    if (data.length !== 0) {
                        for (let i = 0; i < data.length; i++) {
                            let time = data[i].lastseen.substring(0, 19).replace("T", " ");
                            var date = new Date(time);
                            var ms = date.getTime();
                            if (side === "front") {
                                temp.push([ms, data[i].tempf]);
                                humidity.push([ms, data[i].humidityf]);
                            } else {
                                temp.push([ms, data[i].tempb]);
                                humidity.push([ms, data[i].humidityb]);
                            }
                        }
                        this.setState({
                            series: [{ name: 'Temperature', data: temp },
                            { name: 'Humidity', data: humidity }]
                        })
                    } else {
                        $("#nodata").show();
                        this.setState({ error: true, message: 'No data Found!' })
                    }
                }
            })
            .catch((error) => {
                console.log("------>", error);
                if (error.response.status === 403) {
                    $("#displayModal").css("display", "block");
                    $("#content").text("User Session has timed out. Please Login again");
                }
            })
    }

    radioBtnChange = (rackid) => {
        $("[name='rack']").removeAttr("checked");
        $("#nodata").hide();
        let checkVal = $("input[name='rack']:checked").val();
        this.setState({ display: checkVal, animateData: [] });
        $("input[name=rack]").val([checkVal]);
        $("#img_container .assets").remove();
        if (checkVal === "asset") {
            $(".rack-asset-info").css("margin-left", "30%")
            $("#graph_det").css({ "margin-left": "28%", "width": "74%" });
            this.assetData(rackid);
        } else if (checkVal === "thermal") {
            $(".rack-asset-info").css("margin-left", "47%")
            $("#graph_det").css({ "margin-left": "45%", "width": "57%" });
            this.thermalData(rackid);
        } else {
            $(".rack-asset-info").css("margin-left", "30%")
            $("#graph_det").css({ "margin-left": "28%", "width": "74%" });
            this.energyData(rackid);
        }
    }

    tableSlideAnimate = (status) => {
        if (status === "show") {
            $("#details_cus").animate({ "top": "5%" }, "slow")
            $(".card").hide();
        } else if (status === "hide") {
            $("#details_cus").animate({ "top": "-25%" }, "slow")
            $(".card").show();
        }
    }

    energyData = (rackId) => {
        $("#rackImg").attr("src", "../images/mainframe.png");
        $("#rackImg").css({ "width": "200px", "height": "522px" });
        let incValue = 0;
        for (let i = 42; i >= 1; i--) {
            let assetDiv = document.createElement("div");
            $(assetDiv).attr("id", "asset_" + i);
            $(assetDiv).attr("class", "assets");
            $(assetDiv).css({
                "width": "175px",
                "height": "9px",
                "position": "absolute",
                "background": "rgba(16,255,0,0.6)",
                "left": "12px",
                "top": (13 + incValue).toString() + "px",
            });
            $("#img_container").append(assetDiv);
            incValue += 12;
        }

        axios({ method: "GET", url: "/api/energy/racktracking?rackid=" + rackId })
            .then((response) => {
                console.log("energydata =====>", response);
                if (response.status === 200 || response.status === 201) {
                    let data = response.data.energy;
                    if (data.length !== 0) {
                        $("#netpower").text(response.data.net);
                        $("#maxpower").text(response.data.max);
                        $("#minpower").text(response.data.min);
                        for (let i = 0; i < data.length; i++) {
                            // high temperature based descending order and calling
                            if (i === 0) {
                                this.energyServerDet(data[i].tagid);
                            }
                            $("#asset_" + data[i].location).css({
                                "background": "rgba(255,35,0,0.6)",
                                "cursor": "pointer"
                            });
                            $("#asset_" + data[i].location).attr("title",
                                "AssetID : " + data[i].tagid +
                                "\nEnergy : " + data[i].voltage + ' kWh' +
                                "\nLastSeen : " + data[i].lastseen.substring(0, 19).replace("T", " "));
                            $("#asset_" + data[i].location).on("click", () => {
                                this.energyServerDet(data[i].tagid)
                            })
                        }
                    }
                }
            })
            .catch((error) => {
                console.log("assetView ERROR===>", error);
                if (error.response.status === 403) {
                    $("#displayModal").css("display", "block");
                    $("#content").text("User Session has timed out. Please Login again");
                } else {
                    $("#track-error").text(
                        "Request Failed with status code (" + error.response.status + ")."
                    );
                }
            })
    }

    energyServerDet = (assetId) => {
        this.setState({ assetID: assetId });
        this.setState({ series: [] })
        axios({ method: 'GET', url: "/api/track?id=" + assetId })
            .then((response) => {
                console.log("Response====>", response);
                let data = response.data;
                if (response.status === 200 || response.status === 201) {

                    if (data.length !== 0) {
                        let power = [], energy = [];
                        for (let i = 0; i < data.length; i++) {
                            let time = data[i].lastseen.substring(0, 19).replace("T", " ");
                            var date = new Date(time);
                            var ms = date.getTime();
                            power.push([ms, data[i].energy]);
                            energy.push([ms, data[i].power]);
                        }
                        this.setState({
                            series: [
                                { name: 'Power (Actual)', data: power },
                                { name: 'Power* (Ideal)', data: energy }
                            ]
                        });
                    } else {
                        $('#nodata').show();
                        // this.setState({ error: true, message: 'No data Found!' })
                    }
                }

            })
            .catch((error) => {
                console.log("ERROR---->", error);
                if (error.response.status === 403) {
                    $("#displayModal").css("display", "block");
                    $("#content").text("User Session has timed out. Please Login again");
                }
            })
    }
    sessionTimeout = () => {
        $("#displayModal").css("display", "none");
        sessionStorage.removeItem('isLogged')
        window.location.pathname = '/login'
    };

    render() {
        const { series,
            rackID, assetID, display, animateData
        } = this.state;
        return (
            <div style={{
                float: "right", width: "95%", background: '#E5EEF0',
                height: '100vh', marginLeft: '60px', position: "relative",
                overflowX: "hidden",
            }}>
                <div style={{ marginTop: '30px', marginLeft: '60px' }}>
                    <span className='main_header'>REAL-TIME TRACKING</span>
                    <div className='underline'></div>
                    <div className="inputdiv" style={{ marginTop: '20px' }}>
                        <select
                            id="fname"
                            onChange={() => {
                                this.plotFloorMap();
                            }}
                        ></select>
                    </div>

                    <div
                        id="temp"
                        style={{
                            display: "block",
                            position: "relative",
                            width: "fit-content",
                        }}
                    >

                        <img id="tempimg" alt=""></img>
                    </div>
                </div>
                <div id="screen" style={{
                    top: "0px", right: "-70vw",
                    position: "absolute", width: "70vw",
                    height: "132vh", background: "#ffffff",
                    boxShadow: "#0000005c -2px -3px 20px 0px",
                }}>
                    <div style={{ margin: "5px 26px" }}>
                        <div style={{ display: "flex" }}>
                            <h3>RackID : {rackID}</h3>
                            <div onClick={() => this.animation("", "hide")}
                                style={{
                                    cursor: "pointer",
                                    position: "absolute",
                                    fontSize: "22px",
                                    color: "#ff5454",
                                    marginTop: "20px", right: "12px"
                                }}>
                                <span><i className="far fa-times-circle"></i></span>
                            </div>
                        </div>
                        <div id="radio_container" style={{ display: "flex" }}
                            onChange={() => this.radioBtnChange(rackID)}>
                            <label className='radiolabels'>
                                <input value="asset" type="radio" id="asset" name="rack" />
                                <span className='labelspan'>Asset</span>
                            </label>
                            <label className='radiolabels'>
                                <input value="thermal" type="radio" id="thermal" name="rack" />
                                <span className='labelspan'>Thermal</span>
                            </label>
                            <label className='radiolabels'>
                                <input value="energy" type="radio" id="energy" name="rack" />
                                <span className='labelspan'>Energy</span>
                            </label>
                        </div>


                        {/*<div style={{ display: "flex" }}>
                            <p className='rack-asset-info' style={{ display: "flex" }}>
                                <span className='info-box' style={{ background: "#fd4f4f" }}></span>Occupied
                            </p>
                            <p className='rack-asset-info'
                                style={{ marginLeft: "6%", display: "flex" }}>
                                <span className='info-box' style={{ background: "#10ff0099" }}></span>Available
                            </p>
                            </div> */}

                        <div id="screen_content">
                            <div id="img_container"
                                style={{ position: "relative" }}>
                                <img id="rackImg"
                                    style={{
                                        position: "absolute",
                                    }} alt="" />
                            </div>

                            <div id="asset_details" style={{ display: "flex" }}>
                                <p className='rack-asset-info' style={{ marginLeft: "30%" }}>
                                    <button className="fancy-button"
                                        onClick={() => this.tableSlideAnimate("show")}>
                                        Details
                                    </button>
                                </p>
                                {display === "asset" && (
                                    <div className="card">
                                        <div className="content">
                                            <h3 style={{ marginTop: "22px" }}>Asset Details</h3>
                                            <div className="back from-left">
                                                <div style={{ display: "flex" }}>
                                                    <p className="ass-info">Capacity : </p>
                                                    <span className="ass-val" id='assetcapacity'> </span>
                                                </div>
                                                <div style={{ display: "flex" }}>
                                                    <p className="ass-info">AssetCount :</p>
                                                    <span className="ass-val" id='assetcount'> </span>
                                                </div>
                                                <div style={{ display: "flex" }} >
                                                    <p className="ass-info">Available U's : </p>
                                                    <span className="ass-val" id='assetuse'> </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                )}

                                {(display === "thermal" && animateData.length !== 0) &&
                                    (<RackTempAnimation data={animateData, rackID} />)}

                                {display === "energy" && (

                                    <div className="card">
                                        <div className="content">
                                            <h3 style={{ marginTop: "22px" }}>Energy Details</h3>
                                            <div className="back from-left">
                                                <div style={{ display: "flex" }}>
                                                    <p className="ass-info">Net Power : </p>
                                                    <span className="ass-val" id='netpower'> </span>
                                                </div>
                                                <div style={{ display: "flex" }}>
                                                    <p className="ass-info">Max.Power : </p>
                                                    <span className="ass-val" id='maxpower'> </span>
                                                </div>
                                                <div style={{ display: "flex" }}>
                                                    <p className="ass-info">Min.Power : </p>
                                                    <span className="ass-val" id='minpower'></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                )}
                            </div>


                            <div id="graph_det" style={{ marginLeft: "28%", width: "74%", }}>
                                {
                                    series.length > 0 ? (
                                        <div id="chart" style={{
                                            borderRadius: "10px", height: "73vh"
                                        }}>
                                            <div style={{
                                                padding: "15px",
                                                fontSize: "17px",
                                                color: "#00629b"
                                            }}>AssetID : {assetID}</div>
                                            <div id="chart-timeline">
                                                <ApexCharts options={option}
                                                    series={series} type="area" height={430} />
                                            </div>
                                        </div>
                                    ) : null
                                }
                            </div>
                        </div>

                    </div>
                    <div id='nodata' style={{ padding: '5px', textAlign: 'center' }}>
                        <p style={{ fontWeight: 600, color: 'red' }}>No GraphData Found!!!!</p>
                    </div>

                    <div id="details_cus"
                        style={{
                            width: "70%",
                            position: "absolute",
                            top: "-25%", left: "27%"
                        }}>
                        <table id="customers" style={{ boxShadow: "0 0 9px 0px #000" }}>
                            <div className='sidebarmenu'
                                style={{
                                    width: "33px",
                                    height: "33px",
                                    right: "13%",
                                    position: "absolute",
                                    top: "-14%"
                                }}
                                title="Close" onClick={() => this.tableSlideAnimate("hide")}>
                                <i style={{
                                    fontSize: '22px', color: '#ff7171', marginTop: '6px'
                                }} className="far fa-times-circle"></i>
                            </div>
                            <tr>
                                <th>Issue</th>
                                <th>Possible Reasons</th>
                            </tr>
                            <tr>
                                <td>CPU standby power.<br />Consumption increased by 4%</td>
                                <td>Ghost Process</td>
                            </tr>
                            <tr>
                                <td>Hot spot duration > 30mins</td>
                                <td>HVAC</td>
                            </tr>
                            <tr>
                                <td>CPU temp-server Inlet >50</td>
                                <td>CPU Heat Sink</td>
                            </tr>
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
        )
    }
}
