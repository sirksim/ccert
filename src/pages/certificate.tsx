export default function Dashboard({ children }) {
  return (
    <main>
      <div className=".container">
        <h1>Certificate</h1>
        <div>{children}</div>
      </div>
    </main>
  );
}
