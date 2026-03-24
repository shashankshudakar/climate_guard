import { useState } from "react";
import Weather from "./components/Weather";
import Forecast from "./components/Forecast";
import CropAdvisory from "./components/CropAdvisory";
import Alert from "./components/Alert";

export default function App() {
  const [weatherData, setWeatherData] = useState(null);

  return (
    <>
      <Weather setWeatherData={setWeatherData} />

      {weatherData && (
        <>
          <Alert
            temp={weatherData.current.temp_c}
            wind={weatherData.current.wind_kph}
            rain={weatherData.current.precip_mm}
          />

          <Forecast city={weatherData.location.name} />

          <CropAdvisory
            temp={weatherData.current.temp_c}
            rain={weatherData.current.precip_mm}
          />
        </>
      )}
    </>
  );
}