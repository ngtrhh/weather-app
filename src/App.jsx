import { useEffect, useState } from "react";
import useSWR from "swr";

function App() {
  const apiKey = "c633af95497a2d116dfbe2839ac2c781";
  const [forecast, setForecast] = useState();
  const [url, setUrl] = useState(null);

  const fetchToday = async (url) => fetch(url).then((res) => res.json());

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setUrl(
          "https://api.openweathermap.org/data/2.5/weather?lat=" +
            position.coords.latitude +
            "&lon=" +
            position.coords.longitude +
            "&appid=" +
            apiKey
        );
      });
    } else {
      console.log("Geolocation is not available in your browser.");
    }
  }, []);

  // const fetcher = (url) => {
  //   fetch(url).then((r) => {
  //     return r.json();
  //   });
  // };

  // useEffect(() => {
  //   const fetchWeatherToday = async () => {
  //     if ("geolocation" in navigator) {
  //       navigator.geolocation.getCurrentPosition(function (position) {
  //         fetch(
  //           `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}`
  //         )
  //           .then((res) => res.json())
  //           .then((res) => {
  //             setToday(res);
  //           })
  //           .finally(() => setLoading(!loading));

  //         fetch(
  //           `https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}`
  //         )
  //           .then((res) => res.json())
  //           .then((res) => {
  //             setForecast(res.list);
  //           })
  //           .finally(() => setLoading(!loading));
  //       });
  //     } else {
  //       console.log("Geolocation is not available in your browser.");
  //     }
  //   };

  //   fetchWeatherToday();
  // }, []);

  //const { data, error, isLoading } = useSWR("fetchToday", fetcher);
  const { data, error, isLoading } = useSWR(url, (url) => fetchToday(url));

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <div className="main">
      <div className="sidebar">
        <div className="button-wrapper">
          <button style={{ backgroundColor: "#6E707A", color: "#E7E7EB" }}>
            Seach for places
          </button>
          <button
            className="round"
            style={{ backgroundColor: "#6E707A", color: "#E7E7EB" }}
          >
            <span className="material-symbols-outlined">my_location</span>
          </button>
        </div>
        <img src={require("./assets/images/IsoRainSwrsDay.png")} />
        <div className="tempa">
          {Math.round(data?.main?.temp - 273)}
          <span>℃</span>
        </div>
        <div className="weather">{data?.weather[0]?.main}</div>
        <div className="date">
          <div>Today</div>
          <div>•</div>
          <div>
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </div>
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
      </div>
      <div className="container">
        <div className="top">
          <button
            className="round"
            style={{ backgroundColor: "#E7E7EB", color: "#110E3C" }}
          >
            ℃
          </button>
          <button
            className="round"
            style={{ backgroundColor: "#585676", color: "#E7E7EB" }}
          >
            ℉
          </button>
        </div>
        <div className="card-container">
          {forecast?.slice(0, 5).map((item, index) => (
            <div className="card">
              Tomorrow
              <img src={require("./assets/images/ModSleetSwrsDay.png")} />
              <div className="degree">
                <span className="max">16°C</span>
                <span className="min">11°C</span>
              </div>
            </div>
          ))}
        </div>
        <h2>{"Today’s Hightlights"}</h2>
        <div className="information-container">
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
    </div>
  );
}

export default App;
