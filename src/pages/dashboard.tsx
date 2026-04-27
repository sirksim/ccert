export default function Dashboard() {
  return (
    <main>
      <div className=".container">
        <h1>Dashboard</h1>
        <div className="card">
          <h3>Total Certificates</h3>
          <p>14</p>
        </div>
        <div className="card">
          <h3>Expired Soon</h3>
          <p>0</p>
        </div>
        <div className="card">
          <h3>Expired</h3>
          <p>2</p>
        </div>
        <div className="chart">
          <h3>Certificate by status</h3>
          <p>...chart</p>
        </div>
        <section>
          <h3>Certificate Expiring Soon</h3>
          <p></p>
        </section>
        <section>
          <h3>Recente Addition</h3>
        </section>
      </div>
    </main>
  );
}
