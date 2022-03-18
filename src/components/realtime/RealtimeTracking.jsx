import React, { Fragment, Component } from "react";
import common from "../../styling/common.module.css";
import axios from "axios";
import $ from "jquery";

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const graphBtn = {
   width: "150px",
   height: "35px",
   border: "none",
   marginLeft: "15px",
   borderRadius: "4px",
   fontSize: "16px",
   cursor: "pointer",
   color: "Black",
   fontWeight: "bold",
   boxShadow: "3px 3px 5px 3px rgba(0, 0, 0, 0.25)",
};

class RealtimeTracking extends Component {
   constructor(props) {
      super(props);
      this.state = {
         message: "",
         error: false,
         loading: false,
         rackID: "",
      };
   }

   componentDidMount() {
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
               $("#floor-error").text("");
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
                  $("#floor-error").text("Please upload a floormap.");
               }
            } else {
               $("#floor-error").text("Unable to get Floor Map.");
            }
         })
         .catch((error) => {
            if (error.response.status === 403) {
               $("#tracking_displayModal").css("display", "block");
               $("#content").text("User Session has timed out. Please Login again");
            } else if (error.response.status === 404) {
               $("#floor-error").text("No data found.");
            } else {
               $("#floor-error").text(
                  "Request Failed with status code (" + error.response.status + ")."
               );
            }
         });
   }

   componentWillUnmount() {
      clearInterval(this.interval);
      clearTimeout(this.timeout);
      clearTimeout(this.pilot_asset_inter);
   }

   plotFloorMap = () => {
      $("#track-error").text("");
      let floorID = $("#fname").val();
      this.fimage = this.floorData[floorID];
      this.fWidth = this.fimage.width;
      this.fHeight = this.fimage.height;
      $("#tempimg").attr("src", this.fimage.image);
      $("#tempimg").attr("style", "width:" + "auto;" + "height:" + "auto;");
      $("#lastupdated").css("display", "none");
      $("#temp").children("div").remove();
      $("#tempChart").remove();
      $("#temp .sensors").remove();
      $("#graphBlock").css("display", "none");
      $("input[type=text]").val("");
      this.timeout = setTimeout(() => {
         this.rackMonitor();
      }, 2 * 1000);
   };

   rackMonitor = () => {
      let floorID = $("#fname").val();
      $("#track-error").text("");
      this.wp = document.getElementById("temp").clientWidth;
      this.hp = document.getElementById("temp").clientHeight;
      console.log(this.wp, "==========", this.hp);
      this.setState({ rackID: "" });
      axios({
         method: "GET",
         url: "/api/rack/monitor?floorid=" + this.floorData[floorID].id,
      })
         .then((response) => {
            console.log("response=====>", response);
            if (response.status === 200 || response.status === 201) {
               let wpx = this.wp / this.fWidth;
               let hpx = this.hp / this.fHeight;
               if (response.data.length !== 0) {
                  let data = response.data.asset;
                  $("#tempimg").attr(
                     "style",
                     "width:" + this.wp + "px;" + "height:" + this.hp + "px;"
                  );
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
                        xaxis +
                        "px; top:" +
                        yaxis +
                        "px;" +
                        "width:" +
                        width +
                        "px;" +
                        "height:" +
                        height +
                        "px;"
                     );
                     $(childDiv1).on('click', () => this.assetView(data[i].rack, "assetBtn"))
                     $("#temp").append(childDiv1);
                  }
               }
            }
         })
         .catch((error) => {
            console.log("error===>", error);
            if (error.response.status === 403) {
               $("#tracking_displayModal").css("display", "block");
               $("#content").text("User Session has timed out. Please Login again");
            } else if (error.response.status === 404) {
               $("#track-error").text("No zones data found.");
            } else {
               $("#track-error").text(
                  "Request Failed with status code (" + error.response.status + ")."
               );
            }
         });
   };

   assetView = (rackId, optId) => {
      console.log('assetView==========', rackId);
      this.setState({ rackID: rackId });
      $("#popup").css("display", "block");
      this.optionChange(optId);
      $("#asset_rackId").css({ "font-weight": "bold", "margin": "20px", "margin-bottom": "0px" });
      $("#asset_rackId").text("RackID : " + rackId);
      $("#asset_block").css("left", "325px");
      $("#popup_img").attr("src", "../images/assets_tracking.svg");
      $("#popup_img").css({ "width": "200px", "height": "522px" });
      $("#asset_block .assets").remove();
      let incValue = 0;
      for (let i = 42; i >= 1; i--) {
         let assetDiv = document.createElement("div");
         console.log(i, "=======", (13 + incValue));
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
         $("#asset_block").append(assetDiv);
         incValue += 12;
      }

      axios({ method: "GET", url: "/api/asset/racktracking?rackid=" + rackId })
         .then((response) => {
            console.log("assetView =====>", response);
            if (response.status === 200 || response.status === 201) {
               let data = response.data;
               if (data.length !== 0) {
                  for (let i = 0; i < data.length; i++) {
                     $("#asset_" + data[i].location).css({
                        "background": "rgba(255,35,0,0.6)",
                        "cursor": "pointer"
                     });
                     $("#asset_" + data[i].location).attr("title",
                        "AssetID : " + data[i].tagid +
                        "\nLocation : " + data[i].location +
                        "\nLastSeen : " + data[i].lastseen.substring(0, 19).replace("T", " "))
                  }
               }
            }
         })
         .catch((error) => {
            console.log("assetView ERROR===>", error);
            if (error.response.status === 403) {
               $("#tracking_displayModal").css("display", "block");
               $("#content").text("User Session has timed out. Please Login again");
            } else {
               $("#track-error").text(
                  "Request Failed with status code (" + error.response.status + ")."
               );
            }
         })
   }

   thermalView = (rackId, optId) => {
      console.log('thermalView==========', rackId);
      $("#popup").css("display", "block");
      this.optionChange(optId);
      // $("#asset_rackId").css({ "font-weight": "bold", "margin": "20px", "margin-bottom": "0px" });
      // $("#asset_rackId").text("RackID : " + rackId);
      $("#asset_block .assets").remove();
      $("#asset_block").css({ "left": "250px", "top": "-20px" });
      $("#popup_img").attr("src", "../images/thermal_tracking.svg");
      $("#popup_img").css({ "width": "390px", "height": "548px" });
      let incValue = 0;

      for (let i = 42; i >= 1; i--) {
         let assetDiv = document.createElement("div");
         $(assetDiv).attr("id", "asset_" + 1);
         $(assetDiv).attr("class", "assets");
         $(assetDiv).css({
            "width": "175px",
            "height": "9px",
            "position": "absolute",
            "background": "rgba(16,255,0,0.6)",
            "left": "12px",
            "top": (39 + incValue).toString() + "px",
         });
         $("#asset_block").append(assetDiv);
         incValue += 12;
      }

      // axios({ method: "GET", url: "/api/asset/racktracking?rackid=" + rackId })
      //    .then((response) => {
      //       console.log("assetView =====>", response);
      //       if (response.status === 200 || response.status === 201) {
      //          let data = response.data;
      //          if (data.length !== 0) {
      //             for (let i = 0; i < data.length; i++) {
      //                $("#asset_" + data[i].location).css({
      //                   "background": "rgba(255,35,0,0.6)",
      //                   "cursor": "pointer"
      //                });
      //                $("#asset_" + data[i].location).attr("title",
      //                   "AssetID : " + data[i].tagid +
      //                   "\nLocation : " + data[i].location +
      //                   "\nLastSeen : " + data[i].lastseen.substring(0, 19).replace("T", " "))
      //             }
      //          }
      //       }
      //    })
      //    .catch((error) => {
      //       console.log("assetView ERROR===>", error);
      //       if (error.response.status === 403) {
      //          $("#tracking_displayModal").css("display", "block");
      //          $("#content").text("User Session has timed out. Please Login again");
      //       } else {
      //          $("#track-error").text(
      //             "Request Failed with status code (" + error.response.status + ")."
      //          );
      //       }
      //    })
   }

   panicData = () => {
      let alert_data = [];
      let fname = $("#fname").val();
      axios({
         method: "GET",
         url: "/api/alert/panic?floor=" + this.floorData[fname].id,
      })
         .then((response) => {
            if (response.status === 200) {
               let data = response.data;
               if (data.length !== 0) {
                  console.log("alert_data-------->", data);
                  for (let i = 0; i < data.length; i++) {
                     alert_data.push(data[i]);
                  }
               }
            }
         })
         .catch((error) => {
            console.log("plotAssets--error====>", error);
         });
      this.pilot_asset_inter = setTimeout(() => this.plotAssets(alert_data), 2 * 1000);
   };

   plotAssets = (alert_data) => {
      let fname = $("#fname").val();
      $("#total").text("0");
      $("#track-error").text("");
      $("#temp #empls").remove();
      console.log("alert_data---------------->", alert_data);
      axios({
         method: "GET",
         url: "/api/employee/tracking?floor=" + this.floorData[fname].id,
      })
         .then((response) => {
            console.log("plotAssets response========>", response);
            if (response.status === 200) {
               $("#track-error").text("");
               let data = response.data;
               if (data.length !== 0) {
                  let wpx = document.getElementById("temp").clientWidth / this.fWidth;
                  let hpx = document.getElementById("temp").clientHeight / this.fHeight;
                  $("#lastupdated").css("display", "block");
                  let totaltags = 0;
                  for (let i = 0; i < data.length; i++) {
                     let timestamp =
                        new Date() -
                        new Date(data[i].lastseen.substring(0, 19).replace("T", " "));
                     let update_time = "";
                     if (timestamp <= 2 * 60 * 1000) {
                        let color = "blue";
                        update_time = data[i].lastseen.substring(0, 19).replace("T", " ");
                        if (alert_data.length > 0) {
                           for (let j = 0; j < alert_data.length; j++) {
                              if (data[i].tagid === alert_data[j].asset.tagid) {
                                 let time_stamp =
                                    new Date() -
                                    new Date(
                                       alert_data[j].timestamp.substring(0, 10) +
                                       " " +
                                       alert_data[j].timestamp.substring(11, 19)
                                    );
                                 if (time_stamp <= 2 * 60 * 1000) {
                                    if (alert_data[j].value === 1) {
                                       color = "red";
                                       break;
                                    } else if (alert_data[j].value === 3) {
                                       color = "yellow";
                                       break;
                                    } else {
                                       color = "blue";
                                       break;
                                    }
                                 }
                              }
                           }
                        } else {
                           color = "blue";
                        }
                        console.log(data[i].tagid, "PANIC COLOR ------->", color);
                        totaltags = totaltags + 1;

                        let empDiv = document.createElement("div");
                        $(empDiv).attr("id", "empls");
                        $(empDiv).attr("class", "emp_" + data[i].tagid);

                        let inner_circle = document.createElement("div");
                        $(inner_circle).attr(
                           "style",
                           "left:" +
                           (wpx * parseFloat(data[i].x)).toFixed(2) +
                           "px; top:" +
                           (hpx * parseFloat(data[i].y)).toFixed(2) +
                           "px;"
                        );
                        let pulse = document.createElement("div");
                        if (color === "red") {
                           $(inner_circle).attr("class", "inner_circle_red");
                           $(pulse).attr("class", "pulsatingcircle_red");
                        } else if (color === "yellow") {
                           $(inner_circle).attr("class", "inner_circle_yellow");
                           $(pulse).attr("class", "pulsatingcircle_yellow");
                        } else if (color === "blue") {
                           $(inner_circle).attr("class", "inner_circle_blue");
                           $(pulse).attr("class", "pulsatingcircle_blue");
                        }

                        $(inner_circle).attr(
                           "title",
                           "Employee Name  : " +
                           data[i].name +
                           "\nTag ID : " +
                           data[i].tagid +
                           "\nX : " +
                           data[i].x.toFixed(2) +
                           "\nY : " +
                           data[i].y.toFixed(2)
                        );
                        $(inner_circle).append(pulse);
                        $(empDiv).append(inner_circle);
                        $("#temp").append(empDiv);
                        $("#timing").text(update_time);
                     } else if (totaltags === 0) {
                        let upd_Time =
                           data[0].lastseen.substring(0, 10) +
                           " " +
                           data[0].lastseen.substring(11, 19);
                        $("#timing").text(upd_Time);
                     }
                  }
                  $("#total").text(totaltags);
                  if ($("#temp").children("div").length === 0) {
                     $("#track-error").text("No asset detected.");
                  } else {
                     $("#track-error").text("");
                  }
               } else {
                  $("#track-error").text(
                     "No Asset is turned on, Please check System Health Page."
                  );
               }
            } else {
               $("#track-error").text("Unable to get Tags Data.");
            }
         })
         .catch((error) => {
            console.log("error=====>", error);
            if (error.response.status === 403) {
               $("#tracking_displayModal").css("display", "block");
               $("#content").text("User Session has timed out. Please Login again");
            } else if (error.response.status === 404) {
               $("#track-error").text("No Asset data found.");
            } else {
               $("#track-error").text(
                  "Request Failed with status code (" + error.response.status + ")."
               );
            }
         });
   };

   /** Terminate the session on forbidden (403) error */
   sessionTimeout = () => {
      $("#tracking_displayModal").css("display", "none");
      sessionStorage.setItem("isLoggedIn", 0);
      this.props.handleLogin(0);
   };

   optionChange = (btnId) => {
      $("#assetBtn").css({ background: "none", color: "#000" });
      $("#thermalBtn").css({ background: "none", color: "#000" });
      $("#energyBtn").css({ background: "none", color: "#000" });
      console.log("----->", btnId);
      $("#" + btnId).css({ background: "rgb(0, 98, 135)", color: "#FFF" });
   };

   render() {
      const { error, message, rackID } = this.state;
      return (
         <Fragment>
            <div style={{ overflow: 'hidden', float: "right", width: "78%", marginRight: '5px' }}>
               <p className={common.header}>Real-Time Tracking</p>
               {error && (<p className={common.errorMsg}>{message}</p>)}
               <div className="mt-2">
                  <select
                     style={{ width: "30%" }}
                     id="fname"
                     onChange={() => {
                        this.plotFloorMap();
                     }}
                     className="form-select bg-light text-dark border border-secondary mt-2"
                  ></select>
               </div>
               <div>
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

                  <div id='popup'
                     style={{
                        display: "none",
                        width: '800px',
                        height: '590px',
                        overflow: "hidden",
                        top: "240px",
                        left: "350px",
                        position: "absolute",
                        borderRadius: "10px",
                        background: '#FFF',
                        boxShadow: "rgb(0, 0, 0) 10px 18px 50px -10px",
                     }}
                  >
                     <i style={{
                        margin: "15px",
                        float: "right",
                        fontSize: "25px",
                        cursor: "pointer",
                     }}
                        onClick={() => {
                           $("#popup").css("display", "none")
                        }}
                        className="far fa-times-circle">
                     </i>
                     <>
                        <p id="asset_rackId" />
                        {/* <div style={{ display: "flex", margin: "10px 0px 0px 20px" }}>
                           <div style={{
                              width: "10px",
                              height: "10px",
                              marginTop: "6px",
                              marginRight: "5px",
                              background: "rgba(16,255,0,0.9)",
                           }} ></div>
                           <p style={{ marginBottom: "0px" }}>Available Assets</p>
                        </div>

                        <div style={{ display: "flex", margin: "10px 0px 0px 20px" }}>
                           <div style={{
                              width: "10px",
                              height: "10px",
                              marginTop: "6px",
                              marginRight: "5px",
                              background: "rgba(255,0,10,0.9)",
                           }} ></div>
                           <p style={{ marginBottom: "0px" }}>Occupied Assets</p>
                        </div> */}

                        <div style={{
                           position: "absolute",
                           marginLeft: "15px",
                           marginTop: "10px",
                        }}>
                           <button
                              id="assetBtn"
                              className="heading"
                              style={graphBtn}
                              onClick={() => this.assetView(rackID, "assetBtn")}
                           >
                              Asset View
                           </button><br /><br />
                           <button
                              id="thermalBtn"
                              className="heading"
                              style={graphBtn}
                              onClick={() => this.thermalView(rackID, "thermalBtn")}
                           >
                              Thermal View
                           </button><br /><br />
                           <button
                              id="energyBtn"
                              className="heading"
                              style={graphBtn}
                              onClick={() => this.energyView(rackID, "energyBtn")}
                           >
                              Energy View
                           </button>
                        </div>
                     </>

                     <div id="asset_block"
                        style={{
                           position: "relative",
                           // top: "-85px",
                           // left: "325px",
                        }}>
                        <img id="popup_img" style={{
                           position: "absolute",
                           // width: "200px",
                           // height: "522px"
                        }} alt="" />
                        {/* src="../images/assets_tracking.svg" */}
                     </div>
                  </div>
               </div>
            </div>
         </Fragment>
      );
   }
}

export default RealtimeTracking;
