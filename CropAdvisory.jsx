export default function CropAdvisory({ temp, rain }) {
  let crop = "";

  if (temp >= 20 && temp <= 30 && rain >= 100) crop = "🌾 Rice";
  else if (temp >= 15 && temp <= 25 && rain >= 50) crop = "🌽 Maize";
  else if (temp >= 10 && temp <= 20 && rain >= 30) crop = "🥔 Potato";
  else if (temp >= 25 && temp <= 35 && rain <= 50) crop = "🌻 Sunflower";
  else crop = "🌱 Pulses / Millets";

  return (
    <div style={styles.container}>
      <h2>🌾 Crop Advisory</h2>
      <h1>{crop}</h1>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "40vh",
    background: "linear-gradient(120deg,#56ab2f,#a8e063)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
};