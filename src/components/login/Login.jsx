import React, { Component } from 'react'
import axios from 'axios';
import login_style from './login_style.css';
import { login_api } from '../urls/api'



axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export default class Login extends Component {
   constructor(props) {
      super(props)
      this.state = {
         username: '',
         password: '',
         message: true,
         error: false,
         showpwd: false,
      }
   }
   inputHandler = (event) => {
      this.setState({ [event.target.name]: event.target.value })
   }

   login = (event) => {
      event.preventDefault();
      console.log(this.state);
      if (this.state.username && this.state.password) {
         axios({
            method: "POST",
            url: login_api,
            data: { username: this.state.username, password: this.state.password },
         })
            .then((response) => {
               // console.log("response==>", response);
               sessionStorage.setItem("isLogged", "success")
               this.props.parentCallback("success")
            })
            .catch((error) => {
               console.log('error=====>', error);
               if (error.response.status === 403) {
                  this.setState({ error: true, message: 'User session had timed out. Please login again.' });
               } else {
                  this.setState({ error: true, message: error.message });
               }
               sessionStorage.setItem("isLogged", "failed")
               this.props.parentCallback("failed")
            });
      }
      else {
         this.setState({ error: true, message: 'Login Failed' });
         // console.log('Failed..');
      }
   }


   render() {
      const { error, message } = this.state;
      return (
         <div className="backgroundImg" >
            <div className="form_align">
               {error && (
                  <div className="alert alert-danger">
                     <strong>Error!</strong> {message}
                  </div>
               )}
               <form onSubmit={this.login} className="form-group">
                  <div className="mt-1">
                     <label htmlFor="username" style={{ color: '#FFF', fontSize: '20px', marginBottom: '5px' }}>UserName </label>
                     <input type="text"
                        style={{
                           width: '90%',
                           height: '1vw',
                           fontSize: '20px',
                           borderRadius: '5px',
                           // fontFamily: 'serif',
                           padding: '15px',
                           backgroundColor: '#FFF',
                           outlineColor: '#fff',
                           border: "1px solid #FFF",
                           overflow: 'hidden',
                           marginTop: '5px'
                        }}
                        id="username" required name="username" onChange={this.inputHandler} />
                  </div>

                  <div className="mt-2">
                     <label htmlFor="password" style={{ color: '#FFF', fontSize: '20px' }}>Password </label>
                     <input type={this.state.showpwd ? "text" : "password"}
                        style={{
                           width: '90%',
                           height: '1vw',
                           fontSize: '20px',
                           borderRadius: '5px',
                           // fontFamily: 'serif',
                           padding: '15px',
                           backgroundColor: '#FFF',
                           outlineColor: '#fff',
                           border: "1px solid #FFF",
                           overflow: 'hidden',
                           marginTop: '5px',
                           marginBottom: '10px'
                        }}
                        required
                        id="password" name="password" onChange={this.inputHandler} />
                  </div>

                  <div className="form-check mt-3">
                     <input type="checkbox" className="form-check-input" id="showpwd" name="showpwd" onChange={() => this.setState({ showpwd: !this.state.showpwd })} />
                     <label style={{ color: '#fff', fontSize: '18px' }} className="form-check-label" htmlFor="showpwd">Show Password</label>
                  </div>

                  <div className="mt-3">
                     <button type="submit" className="button">Login</button>
                  </div>
               </form>
            </div>
         </div>
      )
   }
}
