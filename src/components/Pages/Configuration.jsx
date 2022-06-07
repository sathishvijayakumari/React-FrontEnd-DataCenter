import React, { Component } from "react";
import Assetreg from "./Assetreg";
import Master from "./Master";
import Rackreg from "./Rackreg";
import Slave from "./Slave";
import Uploadmap from "./Uploadmap";
import $ from "jquery";
import styles from "./styles.css";
import { linkClicked } from "../sidebar/Leftsidebar";

export default class Congiguration extends Component {
  optionList = [false, false, false, false, false];
  constructor() {
    super();
    this.state = {
      flag: false,
    };
  }

  componentDidMount() {
    linkClicked(1);

    this.setState({ flag: true })
    this.optionList[0] = true;
    $("#opt0").css({ "background": "#00629B", "color": "white" });
}
btnOption = (e) => {
    $(".myDIV").parent().find('button').removeClass("active");
    this.setState({ flag: true });
    this.optionList = [false, false, false, false, false];
    this.optionList[e.target.id - 1] = true;
    $("#" + e.target.id).addClass("active");
}
  render() {
    return (
      <div>
        <div id='bgclr'
          style={{
            // float: "right",
            // width: "95%",
            background: "#E5EEF0",
            // height: "100vh",
            marginLeft: "60px",
            paddingTop:'30px'

          }}
        >
          <div style={{ marginLeft: "60px" }}>
            <span className="main_header" style={{marginTop:'30px'}}>REGISTRATION</span>

            <div className="underline"></div>

            <div
              style={{
                marginLeft: "40px",
                marginTop: "50px",
                // display: 'flex'
              }}
            >
            <div className="myDIV" onClick={this.btnOption}>
            <button id="1" className="fancy-button active">Upload FloorMap</button>
            <button id="2" className="fancy-button">Master Gateway</button>
            <button id="3" className="fancy-button">Slave Gateway</button>
            <button id="4" className="fancy-button">Rack Monitor</button>
            <button id="5" className="fancy-button">Asset Tag</button>
        </div>

        <div style={{ width: '85%', padding: '5px', marginTop: '10px' }}>
            {this.optionList[0] && (<Uploadmap />)}
            {this.optionList[1] && (<Master />)}
            {this.optionList[2] && (<Slave />)}
            {this.optionList[3] && (<Rackreg />)}
            {this.optionList[4] && (<Assetreg />)}
    </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
