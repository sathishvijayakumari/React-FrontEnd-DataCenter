import React, { Component } from 'react'
import { upload_floormap, rackmonitor_register } from '../urls/api';
import axios from 'axios';
import $ from 'jquery';
import { SessionOut } from "./Common";

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
export default class Rackreg extends Component {
   constructor() {
      super()
      this.state = {
         message: '',
         error: false,
         success: false,
         value: 0,
      }
   }
   componentDidMount() {
      axios({ method: "GET", url: upload_floormap })
         .then((response) => {
            console.log('Response--->', response);
            let data = response.data;
            if (data.length !== 0 && response.status === 200) {
               for (let i = 0; i < data.length; i++) {
                  $("#fname").append("<option value=" + data[i].id + ">" + data[i].name + "</option>")
               }
            } else {
               this.setState({
                  error: true,
                  message: "No floor map uploaded. Please upload a floor map to begin",
               },
               () => setTimeout( () => this.setState({ message: '' }) ,5000));
            }
         })
         .catch((error) => {
            console.log('Error----->', error);
            if (error.response.status === 403) {
               $("#displayModal").css("display", "block");
               // $("#content").text("User Session has timed out. Please Login again");
            } else {
               this.setState({
                  error: true,
                  message: "Error occurred. Please try again.",
               },
               () => setTimeout( () => this.setState({ message: '' }) ,5000));
            }
         })

   }

   rackRegistration = (e) => {

      e.preventDefault();
      let data = {
         floorid: $("#fname").val(),
         macid: $('#rackid').val(),
         capacity: $('#capacity').val(),
         temp:$('#temp').val(),
         humidity:$('#humid').val(),
         x1: $('#x1').val(),
         x2: $('#x2').val(),
         y1: $('#y1').val(),
         y2: $('#y2').val(),

      }

      if (data.macid && data.capacity && data.x1 && data.y1 && data.x2 && data.y2 &&data.humidity && data.temp !== '') {
         if (
            data.macid.length !== 17 ||
            data.macid.match("^5a-c2-15-[a-x0-9]{2}-[a-x0-9]{2}-[a-x0-9]{2}") === null
         ) {
            this.setState({
               message: "Invalid Rack ID entered. Please check and enter valid one.",
            },
            () => setTimeout( () => this.setState({ message: '' }) ,5000));
         } else {
            axios({
               method: "POST",
               url: rackmonitor_register,
               data: data
            })
               .then((response) => {
                  console.log(response);
                  if (response.status === 201 || response.status === 200) {
                     $("#fname").val('');
                     $('#rackid').val('');
                     $('#capacity').val('');
                     $('#temp').val('');
                     $('#humid').val('');
                     $('#x1').val('');
                     $('#x2').val('');
                     $('#y1').val('');
                     $('#y2').val('');
                     this.setState({
                        success: true,
                        message: "Rack Monitor Registered Successfully.",
                     },
                     () => setTimeout( () => this.setState({ message: '' }) ,5000));

                  }
               })
               .catch((error) => {
                  // console.log(error);
                  if (error.response.status === 403) {
                     $("#displayModal").css("display", "block");
                     // $("#content").text("User Session has timed out. Please Login again");
                  } else if (error.response.status === 400) {
                     this.setState({
                        success: false,
                        error: true,
                        message: "Bad request.",
                     },
                     () => setTimeout( () => this.setState({ message: '' }) ,5000));
                  } else {
                     this.setState({
                        success: false,
                        error: true,
                        message: "Error occurred. Please try again.",
                     },
                     () => setTimeout( () => this.setState({ message: '' }) ,5000));
                  }
               });
         }
      } else {
         this.setState({ error: true, message: 'Please Fillout All Fields' },
         () => setTimeout( () => this.setState({ message: '' }) ,5000))
      }
   }
   sessionTimeout = () => {
      $("#displayModal").css("display", "none");
      sessionStorage.removeItem('isLogged')
      window.location.pathname = '/login'
   };
   render() {
      const { message, error, success } = this.state
      return (
         <div style={{
            marginLeft: "0px",
            marginTop: '20px',
            width: "100%",
            height: "67vh"
         }}>
            {error && (
               <div style={{ color: 'red', marginBottom: '20px' }}>
                  <strong>{message}</strong>
               </div>
            )}

            {success && (
               <div style={{ color: 'green', marginBottom: '20px' }}>
                  <strong>{message}</strong>
               </div>
            )}

            <div style={{ marginTop: '30px', display: 'flex' }}>

               <div>
                  <div className="inputdiv">
                     <span className="label">Floor Name:</span>
                     <select name="fname" id="fname" required="required" />
                  </div>

                  <div className="inputdiv">
                     <span className="label" >X1 :</span>
                     <input type="number" name="x1" id="x1" required="required"
                     />
                  </div>

                  <div className="inputdiv">
                     <span className="label">X2:</span>
                     <input type="number" name="x2" id="x2" required="required"
                     />
                  </div>
                  <div className="inputdiv">
                  <span className="label">Humidity:</span>
                  <input type="number" name="humid" id="humid" required="required"
                  />
               </div>
                  <div className="inputdiv">
                     <span className="label">Capacity:</span>
                     <input type="text" name="capacity" id="capacity" required="required"
                     />
                  </div>
                 
               </div>

               <div style={{ marginLeft: '60px' }}>
                  <div className="inputdiv">
                     <span className="label" style={{ width: '140px' }}>Rack Mac ID :</span>
                     <input type="text" name="rackid" id="rackid" required="required" placeholder='5a-c2-15-07-00-00'
                     />
                  </div>

                  <div className="inputdiv">
                     <span className="label" style={{ width: '140px' }}>Y1 :</span>
                     <input type="number" name="y1" id="y1" required="required"
                     />
                  </div>
                  <div className="inputdiv">
                     <span className="label" style={{ width: '140px' }}>Y2:</span>
                     <input type="number" name="y2" id="y2" required="required"
                     />
                  </div>
                  <div className="inputdiv">
                     <span className="label" style={{ width: '140px' }}>Temperature:</span>
                     <input type="number" name="temp" id="temp" required="required"
                     />
                  </div>

               </div>


            </div>

            <div className='register' style={{ width: '195px' }} onClick={this.rackRegistration}>
               <div
                  style={
                     {
                        marginLeft: '35px',
                        marginTop: '5px',
                        color: 'white',
                        cursor: 'pointer',
                        fontFamily: 'Poppins-Regular'
                     }
                  }>
                  Register Rack
               </div>
               <div>
                  <i style={
                     {
                        fontSize: '20px',
                        marginLeft: '20px',
                        marginTop: '5px',
                        color: 'white'
                     }
                  }
                     className="fas fa-file-plus"></i>
               </div>
            </div>

            {/* SessionOut Component used here!  */}
            <SessionOut />
         </div>
      )
   }
}
