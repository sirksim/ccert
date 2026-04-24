export default function Dashboard({ children }) {
  return (
    <main>
      <div className=".container">
        <h1>Dashboard</h1>
        <div>{children}</div>
      </div>
    </main>
  );
}
