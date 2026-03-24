export default function Alert({ temp, wind, rain }) {
  let alert = "✅ Normal Weather";

  if (temp > 38) alert = "🔥 Heat Wave Alert";
  else if (wind > 35) alert = "🌪 Strong Wind Alert";
  else if (rain > 150) alert = "🌧 Heavy Rain Alert";

  return (
    <div style={styles.box}>
      <h2>{alert}</h2>
    </div>
  );
}

const styles = {
  box: {
    padding: "15px",
    background: "#111",
    color: "white",
    textAlign: "center",
  },
};