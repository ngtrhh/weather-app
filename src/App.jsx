import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import CurrentWeather from "./components/CurrentWeather";

import { WEATHER_API_URL, WEATHER_API_KEY } from "./api";
import Forecast from "./components/Forecast";

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [unit, setUnit] = useState("C");
  const [position, setPosition] = useState(null);

  const max = (array) => Math.max(...array.map((res) => res.main.temp));
  const min = (array) => Math.min(...array.map((res) => res.main.temp));

  const toggleUnit = (value) => {
    if (unit === "C") return Math.round(value) + "°C";
    else return Math.round((value * 9) / 5 + 32) + "°F";
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
    else
      return newDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        fetchCurrentWeather(
          position.coords.latitude,
          position.coords.longitude
        );
        setPosition({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    } else {
      alert("Geolocation not available");
    }
  }, []);

  const fetchCurrentWeather = async (lat, lon) => {
    const currentWeather = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    const forecast = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    Promise.all([currentWeather, forecast])
      .then(async (res) => {
        const weatherResponse = await res[0].json();
        const forecastResponse = await res[1].json();

        setCurrentWeather({
          date: new Date().toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
          ...weatherResponse,
        });

        const groupBy = forecastResponse?.list.reduce(
          //   (accumulator, item) => (
          //     (accumulator[item.dt_txt.split(" ")[0]] =
          //       accumulator[item.dt_txt.split(" ")[0]] || []).push(item),
          //     accumulator
          //   ),
          //   {}
          // );
          (accumulator, item) => {
            const date = item.dt_txt.split(" ")[0];
            (accumulator[date] = accumulator[date] || []).push(item);
            return accumulator;
          },
          {}
        );

        const result = Object.entries(groupBy).map(([key, value]) => ({
          date: convertDate(key),
          min: min(value),
          max: max(value),
          icon: value[0].weather[0].icon,
        }));

        setForecast(result);
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div className="main">
      <Sidebar
        data={currentWeather}
        handleSelectCity={fetchCurrentWeather}
        toggleUnit={toggleUnit}
        position={position}
      />
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

        {forecast && <Forecast data={forecast} toggleUnit={toggleUnit} />}

        {currentWeather && <CurrentWeather data={currentWeather} />}

        <div className="footer">
          created by <span> Nguyen Ngoc Trinh </span> - devChallenges.io
        </div>
      </div>
    </div>
  );
}

export default App;
