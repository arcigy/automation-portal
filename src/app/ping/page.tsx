export default function Ping() {
  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
      <h1>PORTAL IS ALIVE 🚀</h1>
      <p>Time: {new Date().toISOString()}</p>
      <p>Status: Healthy</p>
    </div>
  );
}
