import React from "react";

const CurrentWeather = ({ data }) => {
  return (
    <div>
      <h2>{"Today’s Hightlights"}</h2>
      <div className="current-weather">
        {/* wind */}
        <div className="item">
          <div className="title">Wind status</div>
          <div className="content">
            {data?.wind?.speed}
            <span className="sub"> m/s</span>
          </div>
          <div className="win-deg">
            <div className="deg" style={{ rotate: `${data?.wind?.deg}deg` }}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontVariationSettings: '"FILL" 1',
                  fontSize: "18px",
                }}
              >
                near_me
              </span>
            </div>
            <div>WSW</div>
          </div>
        </div>

        {/* humidity */}
        <div className="item">
          <div className="title">Humidity</div>
          <div className="content">
            {data?.main?.humidity}
            <span className="sub"> %</span>
          </div>
          <div className="label">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${data?.main?.humidity}%` }}
            />
          </div>
        </div>

        <div className="item">
          <div className="title">Visibility</div>
          <div className="content">
            {data?.visibility}
            <span className="sub"> m</span>
          </div>
        </div>

        <div className="item">
          <div className="title">Air Pressure</div>
          <div className="content">
            {data?.main?.pressure}
            <span className="sub"> hPa</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
