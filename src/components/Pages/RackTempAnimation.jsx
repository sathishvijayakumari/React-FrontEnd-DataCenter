import React, { useEffect } from "react";
import "./racktempanimate.css";
import axios from "axios";
import $ from 'jquery'

export default function RackTempAnimation(props) {
    console.log(props.data,'----------------------')
    //  this.rackid=props.data;
    // console.log(this.rackid)
    useEffect(() => {
        main();
        details();
    }, []);

    // adds the correct css classes required to expand the pill and reveal the forecast
    const handlePillExpand = () => {
        const pill = document.querySelector(".pill-container");
        const currentWeather = document.querySelector(".current-weather");
        const weatherForecast = document.querySelector(
            ".weather-forecast-container"
        );

        pill.classList.add("pill-container--expanded");
        currentWeather.classList.add("current-weather--hidden");
        weatherForecast.classList.add("weather-forecast--show");
    };

    // adds the correct css classes required to contract the pill and reveal the current weather
    const handlePillContract = () => {
        const pill = document.querySelector(".pill-container");
        const currentWeather = document.querySelector(".current-weather");
        const weatherForecast = document.querySelector(
            ".weather-forecast-container"
        );

        pill.classList.remove("pill-container--expanded");
        currentWeather.classList.remove("current-weather--hidden");
        weatherForecast.classList.remove("weather-forecast--show");
    };

    // main function that runs on window load and calls everything necessary
    const main = () => {
        const pillContainer = document.querySelector(".pill-container");
        pillContainer.addEventListener("mouseenter", handlePillExpand);
        pillContainer.addEventListener("mouseleave", handlePillContract);
    };

   const details=()=>{
    //    console.log(props.rackId,"racki")
        axios({ method: "GET", url: "/api/thermal/racktracking?rackid=" +props.data})
        .then((response)=>{
            let tempavg=response.data.avgtemp.toFixed(2)
                console.log('tempanimate',response)
                $("#mintemp").text(response.data.mintemp.toFixed(2)+"°C");
                $("#maxtemp").text(response.data.maxtemp .toFixed(2)+"°C");
                $("#avgtemp").text(tempavg+"°C");
                $("#tempavg").text(tempavg+"°C ");
        })
        .catch((error=>{
            console.log(error)
        }))
    }

    return (
        <div className="main-container">
            <div className="header-container">
                <div className="pill-container">
                    <div className="current-weather">
                        <img id='tempimg'
                        style={{width:'50px',marginLeft:'23px'}}
                            alt=""
                            className="current-weather__icon"
                            src='/videos/sun.gif'
                            // src="https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/day.svg"
                        />
                        <p className="current-weather__temp" id='tempavg'><span style={{fontSize:"15px",color:'#00629B'}}> </span></p>
                    </div>
                    <div className="weather-forecast-container">
                        <div className="weather-forecast">
                            <div className="weather-forecast__column">
                                <p className="weather-forecast__date" style={{color:'#00629B'}}>Min</p>
                                <img
                                    alt=""
                                    className="weather-forecast__icon"
                                    src='/videos/coldunscreen.gif'
                                    // src="https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/rainy-2.svg"
                                />
                                <p className="weather-forecast__temp" id='mintemp' style={{color:'#00629B'}}></p>
                            </div>

                            <div className="weather-forecast__column">
                                <p className="weather-forecast__date" style={{color:'#00629B'}}>Max</p>
                                <img
                                    alt=""
                                    className="weather-forecast__icon"
                                    src='/videos/maxtemp.gif'
                                    // src="https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/thunder.svg"
                                />
                                <p className="weather-forecast__temp" id='maxtemp' style={{color:'#00629B'}}></p>
                            </div>

                            <div className="weather-forecast__column">
                                <p className="weather-forecast__date" style={{color:'#00629B'}}>Avg</p>
                                <img
                                    alt=""
                                    className="weather-forecast__icon"
                                    src='/videos/hotunscreen.gif'
                                    // src="https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/day.svg"
                                />
                                <p className="weather-forecast__temp" id='avgtemp' style={{color:'#00629B'}}></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
