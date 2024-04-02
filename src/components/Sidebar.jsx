import React, { useEffect } from "react";
import Drawer from "./Drawer";

const Sidebar = ({ data, toggleUnit, handleSelectCity, position }) => {
  console.log(position);
  return (
    <div className="sidebar">
      <div className="button-wrapper">
        <button data-bs-toggle="offcanvas" href="#drawer">
          Seach for places
        </button>

        <Drawer handleSelectCity={handleSelectCity} />

        <button
          className="round"
          onClick={() => handleSelectCity(position?.lat, position?.lon)}
        >
          <span className="material-symbols-outlined">my_location</span>
        </button>
      </div>
      {data && (
        <>
          <img
            src={`https://openweathermap.org/img/wn/${data?.weather[0]?.icon}@2x.png`}
          />
          <div className="tempa">{toggleUnit(data?.main?.temp)}</div>
          <div className="weather">{data?.weather[0]?.main}</div>
          <div className="date">
            <div>Today</div>
            <div>•</div>
            <div>{data?.date}</div>
          </div>
          <div className="city">
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings: '"FILL" 1',
              }}
            >
              location_on
            </span>
            {data?.name}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
