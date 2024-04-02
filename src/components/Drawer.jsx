import React, { useState } from "react";
import { GEO_API_URL, geoApiOptions } from "../api";

const Drawer = ({ handleSelectCity }) => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const fetchCities = () => {
    fetch(`${GEO_API_URL}/cities?namePrefix=${search}`, geoApiOptions)
      .then((res) => res.json())
      .then((res) => {
        setSearchResults(
          res.data.map((city) => {
            return {
              lat: city.latitude,
              lon: city.longitude,
              label: `${city.name}, ${city.country}`,
            };
          })
        );
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div
      className="offcanvas offcanvas-start"
      tabIndex="-1"
      id="drawer"
      aria-labelledby="offcanvasExampleLabel"
    >
      <div className="offcanvas-header">
        <button
          className="material-symbols-outlined"
          data-bs-dismiss="offcanvas"
        >
          close
        </button>
      </div>
      <div className="offcanvas-body">
        <div className="form">
          <div className="input">
            <span className="material-symbols-outlined">search</span>
            <input
              placeholder="search location"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button onClick={fetchCities}>Search</button>
        </div>
        <ul className="list">
          {searchResults.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelectCity(item.lat, item.lon)}
              data-bs-dismiss="offcanvas"
            >
              {item.label}
              <span className="material-symbols-outlined">chevron_right</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Drawer;
