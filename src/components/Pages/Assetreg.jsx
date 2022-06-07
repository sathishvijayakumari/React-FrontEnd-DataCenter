import React, { Component } from "react";
import axios from "axios";
import $ from 'jquery';
import { upload_floormap, asset_rack_det, asset_register} from '../urls/api';
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
 
export default class Assetreg extends Component {
  constructor(props){
    super();
    this.state={
      error:false,
      success:false,
      message:''
    }

  }
  componentDidMount = () => {
    $("#fname").empty();
    axios({ method: "GET", url: upload_floormap})
       .then((response) => {
          console.log('Response--->', response);
          const data = response.data;
          if (data.length !== 0 && response.status === 200) {
             for (let i = 0; i < data.length; i++) {
                $("#fname").append(
                   "<option value=" + data[i].id + ">" + data[i].name + "</option>"
                );
             }
             this.getRackDetails();
          } else {
             this.setState({
                error: true,
                message: "No floor map uploaded. Please upload a floor map to begin",
             });
          }
       })
       .catch((error) => {
          console.log('Error----->', error);
          if (error.response.status === 403) {
             this.setState({
                error: true,
                message: "User session had timed out. Please login again.",
             });
        
          } else {
             this.setState({
                error: true,
                message: "Error occurred. Please try again.",
             });
          }
       })
 };
 getRackDetails = async () => {
  // console.log('--------', $("#floorName").val());
  // this.setState({ floorid: $("#floorName").val(), error: false, success: false, message: "" });
  axios({
     method: "GET",
     url: asset_rack_det + $("#fname").val(),
  })
     .then((response) => {
        if (response.status === 200) {
           $("#assettag").empty();
           if (response.data.length !== 0) {
              for (let i = 0; i < response.data.length; i++) {
                 $("#assettag").append(
                    "<option value=" +
                    response.data[i].id +
                    ">" +
                    response.data[i].macid +
                    "</option>"
                 );
              }
              // this.setState({ rackno: $("#asset_tag_select1").val() });
           } else {
              this.setState({
                 error: true,
                 success: false,
                 message:
                    "No rack is registered for the floor. Please select some other floor.",
              });
           }
        }
     })
     .catch((error) => {
        console.log(error);
        if (error.response.status === 403) {
           this.setState({
              success: false,
              error: true,
              message: "User session had timed out. Please login again.",
           });
           this.timeout = setTimeout(() => {
              localStorage.setItem("isLogged", "failed");
              window.location.reload = "/"
           }, 1000 * 2)
        } else if (error.response.status === 400) {
           this.setState({
              success: false,
              error: true,
              message: "Request Failed.",
           });
        } else {
           this.setState({
              success: false,
              error: true,
              message: "Error occurred. Please try again.",
           });
        }
     });
};
registerAsset = (e) => {
  e.preventDefault();
 let data={
        tagid : $("#tagid").val(),
         assetsn: $("#assetsno").val(),
         devicemodel: $("#dmodel").val(),
         assetunitusage:  $("#ausage").val(),
         rackno:  $("#assettag").val(),
         address:  $("#address").val(),
         datacenter:  $("#datacenter").val(),
         floorid:  $("#fname").val(),
         rooms:  $("#rooms").val(),
         columns:  $("#columns").val(),
         macaddr:  $("#macaddress").val(),
         description:  $("#description").val(),
         manufacturer:  $("#manufactures").val(),
         serialno:  $("#serialno").val(),
         supplier:  $("#supplier").val(),
         macaddr2:  $("#macaddress2").val(),
         equipmentcategory:  $("#equipcategory").val(),
         lifecycle:  $("#lifecycle").val(),
         maintenancecycle:  $("#mainlifecycle").val(),
         pricipal:  $("#principal").val(),
         maintenancecontact:  $("#maintaincon").val(),
         weight: 0.0,
         power: 0.0,
         current: 0,
         voltage: 0.0,
         firstusetime:  $("#firstusetime").val(),
         inventorycode: $("#inventcode").val(),
         lastmaintenancestaff:  $("#lastmstaff").val(),
         nextmaintenancestaff:  $("#nextmstaff").val(),
         lastupdatedtime:  $("#lastupdatedtime").val(),
         nextupdatedtime:  $("#nextupdatedtime").val(),
 }

 console.log('datas',data)
 
  if (data.tagid.length === 0) {
     this.setState({
        error: true,
        message: "Please enter all mandatory fields.",
     });
  } else if (
     data.tagid.length !== 17 ||
     data.tagid.match("^5a-c2-15-[a-x0-9]{2}-[a-x0-9]{2}-[a-x0-9]{2}") === null
  ) {
     this.setState({
        error: true,
        message:
           'Invalid MAC ID entered. Please enter a valid one. Please follow the pattern "5a-c2-15-00-00-00"',
     });
  } else {
     axios({ method: "POST", url: asset_register, data: data })
        .then((response) => {
           // console.log(response);
           if (response.status === 201) {
              this.setState({
                 success: true,
                 error: false,
                 message: "Asset is registered successfully.",
              });
           } else {
              this.setState({
                 success: true,
                 error: false,
                 message: "Unable to register asset.",
              });
           }
        })
        .catch((error) => {
           // console.log(error);
           if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
            $("#content").text("User Session has timed out. Please Login again");
          }else if (error.response.status === 400) {
              this.setState({
                 success: false,
                 error: true,
                 message: "Bad Request.",
              });
           } else if (error.response.status === 406) {
              this.setState({
                 success: false,
                 error: true,
                 message:
                    "Maximum unit storage left is : " +
                    error.response.data.capacity,
              });
           } else {
              this.setState({
                 success: false,
                 error: true,
                 message:
                    "Error occurred while registering asset. Please try again.",
              });
           }
        });
  }
};
sessionTimeout = () => {
  $("#displayModal").css("display", "none");
  sessionStorage.removeItem('isLogged')
  window.location.pathname='/login'
};

  render() {
    const{error,message,success}=this.state;
    return (
      <div >
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
        <div style={{ marginTop: "10px", justifyContent: "space-between" }}>
          <p
            style={{
              fontSize: "25px",
              marginTop: "0px",
              marginBottom: "12px",
              color: "#00629B",
              fontWeight: 500,
            }}
          >
            Assets
          </p>
          <form>
          <div className="inputdiv">
            <input type="text" placeholder="Tag MAC ID" id="tagid" />
          </div>

          <p
            style={{
              fontSize: "25px",
              marginTop: "10px",
              marginBottom: "12px",
              color: "#00629B",
              fontWeight: 500,
            }}
          >
            Basic Info
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "85%",
            }}
          >
            <div className="inputdiv">
              <input type="text" placeholder="Asset SN" id="assetsno" />
            </div>

            <div className="inputdiv">
              <input type="text" placeholder="Device Model" id="dmodel" />
            </div>
            <div className="inputdiv">
              <input type="text" placeholder="Asset Usage" id="ausage" />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "85%",
            }}
          >
            <div className="inputdiv">
              <select placeholder="Asset SN" id="assettag" />
            </div>

            <div className="inputdiv">
              <input type="text" placeholder="Address" id="address" />
            </div>
            <div className="inputdiv">
              <input type="text" placeholder="Data Center" id="datacenter" />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "85%",
            }}
          >
            <div className="inputdiv">
              <select placeholder="Asset SN" id="fname" />
            </div>

            <div className="inputdiv">
              <input type="text" placeholder="Rooms" id="rooms" />
            </div>
            <div className="inputdiv">
              <input type="text" placeholder="Columns" id="columns" />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "85%",
            }}
          >
            <div className="inputdiv">
              <input type="text" placeholder="MAC Address" id="macaddress" />
            </div>

            <div className="inputdiv">
              <input type="text" placeholder="Description" id="description" />
            </div>
            <div className="inputdiv">
              <input
                type="text"
                placeholder="Manufacturers"
                id="manufactures"
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "85%",
            }}
          >
            <div className="inputdiv">
              <input type="text" placeholder="Serial Number" id="serialno" />
            </div>

            <div className="inputdiv">
              <input type="text" placeholder="Supplier" id="supplier" />
            </div>

            <div className="inputdiv">
              <input type="text" placeholder="Mac Address2" id="macaddress2" />
            </div>
          </div>

          <p
            style={{
              fontSize: "25px",
              marginTop: "10px",
              marginBottom: "12px",
              color: "#00629B",
              fontWeight: 500,
            }}
          >
            Pro Info
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "85%",
            }}
          >
            <div className="inputdiv">
              <input
                type="text"
                placeholder="Equipment Category"
                id="equipcategory"
              />
            </div>

            <div className="inputdiv">
              <input type="text" placeholder="Life Cycle" id="lifecycle" />
            </div>
            <div className="inputdiv">
              <input
                type="text"
                placeholder="Maintenance Life Cycle"
                id="mainlifecycle"
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "85%",
            }}
          >
            <div className="inputdiv">
              <input type="text" placeholder="principal" id="principal" />
            </div>

            <div className="inputdiv">
              <input
                type="text"
                placeholder="Maintainance Contact"
                id="maintaincon"
              />
            </div>
            <div className="inputdiv">
              <input type="number" placeholder="Weight(Kg)" id="weight" />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "85%",
            }}
          >
            <div className="inputdiv">
              <input type="number" placeholder="Power (W)" id="power" />
            </div>

            <div className="inputdiv">
              <input type="number" placeholder="Current (A)" id="current" />
            </div>
            <div className="inputdiv">
              <input type="number" placeholder="Voltage (V)" id="voltage" />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "85%",
            }}
          >
            <div className="inputdiv">
              <input type="datetime-local" id='firstusetime' />
            </div>

            <div className="inputdiv">
              <input type="text" placeholder="Inventory Code" id="inventcode" />
            </div>
            <div className="inputdiv">
              <input
                type="text"
                placeholder="Last Maintenance Staff"
                id="lastmstaff"
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "85%",
            }}
          >
            <div className="inputdiv">
              <input
                type="text"
                placeholder="Next Maintenance Staff"
                id="nextmstaff"
              />
            </div>

            <div className="inputdiv">
              <input type="datetime-local" id='lastupdatedtime' />
            </div>
            <div className="inputdiv">
              <input type="datetime-local" id='nextupdatedtime' />
            </div>
          </div>
          <div
          className="register"
          style={{ width: "190px", marginLeft: "330px",marginBottom:'50px'}}
          onClick={this.registerAsset}
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
            Register AssetTag
          </div>
          <div>
            <i
              style={{
                fontSize: "20px",
                marginLeft: "10px",
                marginTop: "7px",
                color: "white",
              }}
              className="fas fa-file-plus"
            ></i>
          </div>
        </div>
          </form>
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
    );
  }
}
