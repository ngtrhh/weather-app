import { useEffect, useState } from "react";
import useSWR from "swr";

function App() {
  const apiKey = "c633af95497a2d116dfbe2839ac2c781";
  const [url, setUrl] = useState(null);
  const [minMaxDaily, setMinMaxDaily] = useState([]);
  const [unit, setUnit] = useState("C");

  const fetcher = async (url) => fetch(url).then((res) => res.json());

  const max = (array) => Math.max(...array.map((res) => res.main.temp));
  const min = (array) => Math.min(...array.map((res) => res.main.temp));

  const groupBy = (array) =>
    array.reduce(
      (accumulator, item) => (
        (accumulator[item.dt_txt.split(" ")[0]] =
          accumulator[item.dt_txt.split(" ")[0]] || []).push(item),
        accumulator
      ),
      {}
    );

  const convertUnit = (value) => {
    if (unit === "C") return Math.round(value - 273);
    else return Math.round(value * 1.8 - 459.67);
  };

  const convertDate = (date) => {
    const newDate = date ? new Date(date) : new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (
      tomorrow.toLocaleDateString("en-US") ===
      newDate.toLocaleDateString("en-US")
    )
      return "Tomorrow";
    return newDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const {
    data: today,
    todayError,
    todayLoading,
  } = useSWR(url?.today, (url) => fetcher(url));

  const {
    data: forecast,
    forecastError,
    forecastLoading,
  } = useSWR(url?.forecast, (url) => fetcher(url));

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setUrl({
          today:
            "https://api.openweathermap.org/data/2.5/weather?lat=" +
            position.coords.latitude +
            "&lon=" +
            position.coords.longitude +
            "&appid=" +
            apiKey,
          forecast:
            "https://api.openweathermap.org/data/2.5/forecast?lat=" +
            position.coords.latitude +
            "&lon=" +
            position.coords.longitude +
            "&appid=" +
            apiKey,
        });
      });
    } else {
      console.log("Geolocation is not available in your browser.");
    }
  }, []);

  useEffect(() => {
    if (forecast) {
      const result = Object.entries(groupBy(forecast?.list)).map(
        ([key, val]) => ({
          date: convertDate(key),
          min: min(val),
          max: max(val),
        })
      );

      setMinMaxDaily(result);
    }
  }, [forecast]);

  if (todayError || forecastError) return <div>failed to load</div>;
  if (todayLoading || forecastLoading) return <div>Loading...</div>;

  return (
    <div className="main">
      <div className="sidebar">
        <div className="button-wrapper">
          <button data-bs-toggle="offcanvas" href="#drawer">
            Seach for places
          </button>

          <div
            class="offcanvas offcanvas-start"
            tabindex="-1"
            id="drawer"
            aria-labelledby="offcanvasExampleLabel"
          >
            <div class="offcanvas-header">
              <button
                className="material-symbols-outlined"
                data-bs-dismiss="offcanvas"
              >
                close
              </button>
            </div>
            <div class="offcanvas-body">
              <form>
                <div className="input">
                  <span className="material-symbols-outlined">search</span>{" "}
                  <input
                    placeholder="search location"
                    // value={inputValue}
                    // disabled={disabled}
                    // onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
                <button>Search</button>
              </form>
              <div class="dropdown mt-3">
                <button
                  class="dropdown-toggle dropdown"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  Dropdown button
                </button>
                <ul class="dropdown-menu">
                  <li>
                    <a class="dropdown-item" href="#">
                      Action
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <button className="round">
            <span className="material-symbols-outlined">my_location</span>
          </button>
        </div>
        <img src={require("./assets/images/IsoRainSwrsDay.png")} />
        <div className="tempa">
          {convertUnit(today?.main?.temp)}
          <span>{unit === "C" ? "°C" : "°F"}</span>
        </div>
        <div className="weather">{today?.weather[0]?.main}</div>
        <div className="date">
          <div>Today</div>
          <div>•</div>
          <div>{convertDate()}</div>
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
          {today?.name}
        </div>
      </div>
      <div className="container">
        <div className="top">
          <button
            className={"round " + (unit === "C" ? "actived" : "unactived")}
            onClick={() => setUnit("C")}
          >
            ℃
          </button>
          <button
            className={"round " + (unit === "F" ? "actived" : "unactived")}
            onClick={() => setUnit("F")}
          >
            ℉
          </button>
        </div>
        <div className="card-container">
          {minMaxDaily.slice(1).map((item, index) => {
            return (
              <div className="card" key={index}>
                {item.date}
                <img src={require("./assets/images/ModSleetSwrsDay.png")} />
                <div className="degree">
                  <span className="max">
                    {convertUnit(item.max)}
                    {unit === "C" ? "°C" : "°F"}
                  </span>
                  <span className="min">
                    {convertUnit(item.min)}
                    {unit === "C" ? "°C" : "°F"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <h2>{"Today’s Hightlights"}</h2>
        <div className="information-container">
          {/* wind */}
          <div className="item">
            <div className="title">Wind status</div>
            <div className="content">
              {today?.wind?.speed}
              <span className="sub"> m/s</span>
            </div>
            <div className="win-deg">
              <div className="deg" style={{ rotate: `${today?.wind?.deg}deg` }}>
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
              {today?.main?.humidity}
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
                style={{ width: `${today?.main?.humidity}%` }}
              />
            </div>
          </div>

          <div className="item">
            <div className="title">Visibility</div>
            <div className="content">
              {today?.visibility}
              <span className="sub"> m</span>
            </div>
          </div>

          <div className="item">
            <div className="title">Air Pressure</div>
            <div className="content">
              {today?.main?.pressure}
              <span className="sub"> hPa</span>
            </div>
          </div>
        </div>
        <div className="footer">
          created by <span>Nguyen Ngoc Trinh</span> - devChallenges.io
        </div>
      </div>
    </div>
  );
}

export default App;
