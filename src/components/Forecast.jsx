import React from "react";

const Forecast = ({ data, toggleUnit }) => {
  return (
    <div className="forecast">
      {data.slice(1).map((item, index) => {
        return (
          <div className="item" key={index}>
            {item.date}
            <img
              src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
            />
            <div className="degree">
              <span className="max">{toggleUnit(item.max)}</span>
              <span className="min">{toggleUnit(item.min)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Forecast;
