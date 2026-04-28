export default function Login() {
  return (
    <main>
      <h1>Login</h1>
      <form id="loginForm">
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" required />
          <p></p>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" required />
          <p></p>
        </div>
        <a href="/reset">Forgot Password</a>
        <button>Login</button>
      </form>
    </main>
  );
}
