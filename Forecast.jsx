import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const API_KEY = "dd2a578ea24544e0ae1111720262602";

export default function Forecast({ city }) {
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    if (!city) return;

    const getForecast = async () => {
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=no&alerts=no`
      );
      const data = await res.json();
      setForecast(data.forecast.forecastday);
    };

    getForecast();
  }, [city]);

  if (!forecast) return null;

  return (
    <div style={styles.container}>
      <h2>📅 7-Day Forecast</h2>

      <div style={styles.cards}>
        {forecast.map((day) => (
          <div key={day.date} style={styles.card}>
            <p>{day.date}</p>
            <img src={day.day.condition.icon} alt="" />
            <h3>{day.day.avgtemp_c}°C</h3>
          </div>
        ))}
      </div>

      <div style={styles.chartBox}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={forecast.map((d) => ({
              date: d.date,
              temp: d.day.avgtemp_c,
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="temp" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    background: "linear-gradient(120deg,#1CB5E0,#000046)",
    color: "white",
    textAlign: "center",
  },
  cards: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "15px",
  },
  card: {
    background: "rgba(255,255,255,0.15)",
    padding: "10px",
    borderRadius: "10px",
    width: "120px",
  },
  chartBox: {
    marginTop: "25px",
    background: "white",
    borderRadius: "15px",
    padding: "15px",
    color: "black",
  },
};