import { useState } from "react";

const API_KEY = "dd2a578ea24544e0ae1111720262602";

export default function Weather({ setWeatherData }) {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);

  const getWeather = async () => {
    if (!city) return;

    const res = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`
    );
    const result = await res.json();

    setData(result);
    setWeatherData(result);
  };

  return (
    <div style={styles.container}>
      <h1>🌍 ClimateGuard - Live Weather</h1>

      <div style={styles.search}>
        <input
          style={styles.input}
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button style={styles.button} onClick={getWeather}>
          Get Weather
        </button>
      </div>

      {data && (
        <div style={styles.card}>
          <h2>
            {data.location.name}, {data.location.country}
          </h2>
          <img src={data.current.condition.icon} alt="" />
          <h1>{data.current.temp_c}°C</h1>
          <p>{data.current.condition.text}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "60vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(120deg,#00c6ff,#0072ff)",
    color: "white",
  },
  search: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
  },
  button: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#111",
    color: "white",
  },
  card: {
    background: "rgba(255,255,255,0.15)",
    padding: "20px",
    borderRadius: "15px",
    textAlign: "center",
  },
};