import React, { useEffect, useState } from "react";
import { master_register, slave_register, assettag_det } from "../urls/api";
import $ from "jquery";
import "./styles.css";
import axios from "axios";

export default function HealthExam() {
   const [change, setChange] = useState(false);
   useEffect(() => {
      // getDatas();
      // setInterval(() => {
      //    getDatas();
      // }, 15 * 1000);

      healthType()
   }, []);

   function getDatas() {
      axios({ method: "GET", url: assettag_det })
         .then((response) => {
            const data = response.data;
            console.log('=====>', response);
            if (data.length !== 0 && response.status === 200) {
               $("#assethealth tbody").empty();
               for (let i = 0; i < data.length; i++) {
                  if (data.length > 11) {
                     $('#divheight').css('height', 'fit-content')
                  } else {
                     $('#divheight').css('height', '100vh')
                  }
                  let status = 'red';
                  if ((new Date() - new Date(data[i].lastseen)) <= (2 * 60 * 1000)) {
                     status = "green";
                  }
                  $("#assethealth").append(
                     "<tr>" +
                     "<td>" + (i + 1) + "</td>" +
                     "<td>" + data[i].tagid + "</td>" +
                     "<td>" + data[i].battery + "</td>" +
                     "<td>" + data[i].lastseen.replace("T", " ").substr(0, 19) + "</td>" +
                     "<td>" +
                     "<div style = 'margin:auto;width:12px;height: 12px;border-radius:12px;background-color:" + status + "'></div></td> " +
                     "</tr>"
                  )
               }

               getPagination1("#assethealth");
            }
         })
         .catch((error) => {
            console.log('Health assests tag gate Error====', error);
            if (error.response.status === 403) {
               $("#displayModal").css("display", "block");
               $("#content").text("User Session has timed out. Please Login again");
            } else {
               // this.setState({ error: true, message: "Request Failed." });
            }
         })

   }


   function healthType() {
      let value = $("#healthtype").val();
      console.log('value====>', value);
      if ($("#healthtype").val() === 'Asset') {
         $(".mastertable").hide();
         $(".slavetable").hide();
         $(".assethealth").show();

         axios({ method: "GET", url: assettag_det })
            .then((response) => {
               const data = response.data;
               if (data.length > 11) {
                  $('#divheight').css('height', 'fit-content')
               } else {
                  $('#divheight').css('height', '100vh')
               }
               console.log('=====>', response);
               if (data.length !== 0 && response.status === 200) {
                  $("#slavetable tbody").empty();
                  $("#assethealth tbody").empty();
                  for (let i = 0; i < data.length; i++) {
                     let status = 'red';
                     if ((new Date() - new Date(data[i].lastseen)) <= (2 * 60 * 1000)) {
                        status = "green";
                     }
                     $("#assethealth").append(
                        "<tr>" +
                        "<td>" + (i + 1) + "</td>" +
                        "<td>" + data[i].tagid + "</td>" +
                        "<td>" + data[i].battery + "</td>" +
                        "<td>" + data[i].lastseen.replace("T", " ").substr(0, 19) + "</td>" +
                        "<td>" +
                        "<div style = 'margin:auto;width:12px;height: 12px;border-radius:12px;background-color:" + status + "'></div>" + "</td> " +
                        "</tr>"
                     )
                  }
                  getPagination1("#assethealth");
               } else {
                  // this.setState({
                  //    error: true,
                  //    message: "No Health Data Found For Assets.",
                  // });
               }
            })
            .catch((error) => {
               console.log('Health assests tag gate Error====', error);
               if (error.response.status === 403) {
                  $("#displayModal").css("display", "block");
                  $("#content").text("User Session has timed out. Please Login again");
               } else {
                  // this.setState({ error: true, message: "Request Failed." });
               }
            })
      }
      else if ($("#healthtype").val() === "Master") {
         $(".mastertable").show();
         $(".slavetable").hide();
         $(".assethealth").hide();
         axios({ method: "GET", url: master_register })
            .then((response) => {
               const data = response.data;
               console.log(data);
               if (data.length !== 0 && response.status === 200) {
                  $("#mastertable tbody").empty();
                  if (data.length > 11) {
                     $('#divheight').css('height', 'fit-content')
                  } else {
                     $('#divheight').css('height', '100vh')
                  }
                  for (let i = 0; i < data.length; i++) {
                     let status = 'red';
                     if ((new Date() - new Date(data[i].lastseen)) <= (2 * 60 * 1000)) {
                        status = "green";
                     }

                     $("#mastertable").append(
                        "<tr>" +
                        "<td>" + (i + 1) + "</td>" +
                        "<td>" + data[i].gatewayid + "</td>" +
                        "<td>" + data[i].floor.name + "</td>" +
                        "<td>" + data[i].lastseen.replace("T", " ").substr(0, 19) + "</td>" +
                        "<td>" +
                        "<div style = 'margin:auto;width:12px;height: 12px;border-radius:12px;background-color:" + status + "'></div>" + "</td > " +
                        "</tr>"
                     )
                  }
               } else {
                  // this.setState({
                  //    error: true,
                  //    message: "No data found for Master Gateway.",
                  // });
               }
            })

            .catch((error) => {
               if (error.response.status === 404) {
                  this.setState({ error: true, message: 'No Health Data Found For Master' })
               } else if (error.response.status === 403) {
                  $("#displayModal").css("display", "block");
                  $("#content").text("User Session has timed out. Please Login again");
               }
            })
      }
      else if ($("#healthtype").val() === "Slave") {
         $(".mastertable").hide();
         $(".slavetable").show();
         $(".assethealth").hide();

         axios({ method: "GET", url: slave_register })
            .then((response) => {
               const data = response.data;
               console.log('=====>slave', data);
               if (data.length > 11) {
                  $('#divheight').css('height', 'fit-content')
               } else {
                  $('#divheight').css('height', '100vh')
               }
               if (data.length !== 0 && response.status === 200) {
                  $("#assethealth tbody").empty();
                  $("#slavetable tbody").empty();
                  for (let i = 0; i < data.length; i++) {
                     let status = 'red';
                     if ((new Date() - new Date(data[i].lastseen)) <= (2 * 60 * 1000)) {
                        status = "green";
                     }
                     $("#slavetable").append(
                        "<tr>" +
                        "<td>" + (i + 1) + "</td>" +
                        "<td>" + data[i].gatewayid + "</td>" +
                        "<td>" + data[i].master.floor.name + "</td>" +
                        "<td>" + data[i].master.gatewayid + "</td>" +
                        "<td>" + data[i].lastseen.replace("T", " ").substr(0, 19) + "</td>" +
                        "<td>" +
                        "<div style = 'margin:auto;width:12px;height: 12px;border-radius:12px;background-color:" + status + "'></div></td> " +
                        "</tr>"
                     )
                  }
                  getPagination2("#slavetable");
               } else {
                  // this.setState({
                  //    error: true,
                  //    message: "No Health Data found for Slave Gateway.",
                  // });
               }
            })
            .catch((error) => {
               console.log('Health Slave gate Error====', error);
               if (error.response.status === 403) {
                  $("#displayModal").css("display", "block");
                  $("#content").text("User Session has timed out. Please Login again");
               } else {
                  // this.setState({ error: true, message: "Request Failed." });
               }
            })
      }
   };

   function getPagination1(table) {
      var lastPage = 1;
      $("#maxRows").on("change", function (evt) {
         lastPage = 1;
         $("#prev1").css({ background: "#d7e1f4", color: "#000" });
         $("#prev").css({ background: "#006287", color: "#FFF" });
         var trnum = 0;
         var maxRows = parseInt($(this).val());
         // console.log("maxRows------->", maxRows);
         if (maxRows === 5000) {
            $(".pagination").hide();
         } else {
            $(".pagination").show();
         }
         $("#assethealth tr:gt(0)").each(function () {
            trnum++;
            if (trnum > maxRows) {
               $(this).hide();
            }
            if (trnum <= maxRows) {
               $(this).show();
            }
         });
         $('.pagination [data-page="1"]').addClass("active");
         $(".pagination .moving").on("click", function (evt) {
            evt.stopImmediatePropagation();
            evt.preventDefault();
            var pageNum = $(this).attr("data-page");
            var maxRows = parseInt($("#maxRows").val());

            if (pageNum === "prev") {
               if (lastPage === 1) {
                  return;
               }
               pageNum = --lastPage;
            }
            var rowCount = $("#assethealth tbody tr").length;
            let nxtCheck = 0;
            if (rowCount % maxRows === 0) {
               nxtCheck = parseInt(rowCount / maxRows);
            } else {
               nxtCheck = parseInt(rowCount / maxRows) + 1;
            }
            if (pageNum === "next") {
               if (lastPage === nxtCheck) {
                  return;
               }
               pageNum = lastPage + 1;
            }
            lastPage = pageNum;
            if (lastPage === nxtCheck) {
               $("#prev1").css({ background: "#006287", color: "#FFF" });
               $("#prev").css({ background: "#d7e1f4", color: "#000" });
            } else if (lastPage === 1) {
               $("#prev").css({ background: "#006287", color: "#FFF" });
               $("#prev1").css({ background: "#d7e1f4", color: "#000" });
            } else {
               $("#prev").css({ background: "#006287", color: "#FFF" });
               $("#prev1").css({ background: "#006287", color: "#FFF" });
            }
            var trIndex = 0;
            $(".pagination .moving").removeClass("active");
            $('.pagination [data-page="' + lastPage + '"]').addClass("active");
            $("#assethealth tr:gt(0)").each(function () {
               trIndex++;
               if (
                  trIndex > maxRows * pageNum ||
                  trIndex <= maxRows * pageNum - maxRows
                  ) {
                  console.log("%%%%%", trIndex);
                  $(this).hide();
               } else {
                  console.log("%%%%%=====", trIndex);
                  $(this).show();
               }
            });
         });
      })
         .val(2)
         .change();
   }

   function getPagination2(table) {
      var lastPage = 1;
      $("#maxRows").on("change", function (evt) {
         lastPage = 1;
         $("#prev1").css({ background: "#d7e1f4", color: "#000" });
         $("#prev").css({ background: "#006287", color: "#FFF" });
         var trnum = 0;
         var maxRows = parseInt($(this).val());
         // console.log("maxRows------->", maxRows);
         if (maxRows === 5000) {
            $(".pagination").hide();
         } else {
            $(".pagination").show();
         }
         $("#slavetable tr:gt(0)").each(function () {
            trnum++;
            if (trnum > maxRows) {
               $(this).hide();
            }
            if (trnum <= maxRows) {
               $(this).show();
            }
         });
         $('.pagination [data-page="1"]').addClass("active");
         $(".pagination .moving").on("click", function (evt) {
            evt.stopImmediatePropagation();
            evt.preventDefault();
            var pageNum = $(this).attr("data-page");
            var maxRows = parseInt($("#maxRows").val());

            if (pageNum === "prev") {
               if (lastPage === 1) {
                  return;
               }
               pageNum = --lastPage;
            }
            var rowCount = $("#slavetable tbody tr").length;
            let nxtCheck = 0;
            if (rowCount % maxRows === 0) {
               nxtCheck = parseInt(rowCount / maxRows);
            } else {
               nxtCheck = parseInt(rowCount / maxRows) + 1;
            }
            if (pageNum === "next") {
               if (lastPage === nxtCheck) {
                  return;
               }
               pageNum = lastPage + 1;
            }
            lastPage = pageNum;
            if (lastPage === nxtCheck) {
               $("#prev1").css({ background: "#006287", color: "#FFF" });
               $("#prev").css({ background: "#d7e1f4", color: "#000" });
            } else if (lastPage === 1) {
               $("#prev").css({ background: "#006287", color: "#FFF" });
               $("#prev1").css({ background: "#d7e1f4", color: "#000" });
            } else {
               $("#prev").css({ background: "#006287", color: "#FFF" });
               $("#prev1").css({ background: "#006287", color: "#FFF" });
            }
            var trIndex = 0;
            $(".pagination .moving").removeClass("active");
            $('.pagination [data-page="' + lastPage + '"]').addClass("active");
            $("#slavetable tr:gt(0)").each(function () {
               trIndex++;
               if (
                  trIndex > maxRows * pageNum ||
                  trIndex <= maxRows * pageNum - maxRows
               ) {
                  console.log("%%%%%", trIndex);
                  $(this).hide();
               } else {
                  console.log("%%%%%=====", trIndex);
                  $(this).show();
               }
            });
         });
      })
         .val(2)
         .change();
   }

   return (
      <div
         id='divheight'
         style={{
            float: "right",
            width: "95%",
            background: "#E5EEF0",
            height: "100vh",
            marginLeft: "60px",
         }}
      >
         <div style={{ marginTop: "30px", marginLeft: "60px" }}>
            <span className="main_header">SYSTEM HEALTH</span>
            <div className="underline"></div>
            <div className="inputdiv" style={{ marginTop: "20px" }}>
               <span className="label">Health:</span>
               <select
                  name="healthtype"
                  id="healthtype"
                  required="required"
                  onChange={() => healthType()}
               >
                  <option>Slave</option>
                  <option>Asset</option>
                  <option>Master</option>
               </select>
            </div>
            <div>
               <div>
                  <select className="form-control" name="state" id="maxRows">
                     <option value="5000">Show ALL Rows</option>
                     <option value="2">2</option>
                     <option value="50">50</option>
                     <option value="70">70</option>
                     <option value="100">100</option>
                  </select>
               </div>

               <div className="assethealth">
                  <table id="assethealth">
                     <tr>
                        <th>S.NO</th>
                        <th>ASSET MAC ID</th>
                        <th>BATTERY STATUS(%)</th>
                        <th>LAST SEEN</th>
                        <th>STATUS</th>
                     </tr>
                     <tbody id="asset_health"></tbody>
                  </table>
               </div>

               <div className="slavetable">
                  <table id="slavetable">
                     <thead>
                        <tr>
                           <th>S.NO</th>
                           <th>SLAVE ID</th>
                           <th>FLOOR NAME</th>
                           <th>MASTER GATEWAY ID</th>
                           <th>LAST SEEN</th>
                           <th>STATUS</th>
                        </tr>
                     </thead>
                     <tbody id="slave_table" ></tbody>
                  </table>
               </div>

               <div className="pagination-container">
                  <div className="pagination">
                     <div
                        id="prev1"
                        className="moving"
                        data-page="prev"
                        style={{ marginRight: "30px" }}
                     >
                        <span>Prev</span>
                     </div>
                     <div className="moving" data-page="next" id="prev">
                        <span>Next</span>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>
   );
}
