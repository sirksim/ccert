export default function Login() {
  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand">
          <div>
            <p className="login-eyebrow">Plateforme de certification</p>
            <h1 id="login-title">Connexion</h1>
          </div>
        </div>

        <form id="loginForm" className="login-form" noValidate>
          <div className="form-group">
            <label htmlFor="email">Adresse email</label>
            <div className="input-shell">
              <i className="fa-regular fa-envelope" aria-hidden="true"></i>
              <input
                type="email"
                name="email"
                id="email"
                inputMode="email"
                autoComplete="email"
                placeholder="nom@exemple.com"
                required
                aria-describedby="emailError"
              />
            </div>
            <p id="emailError" className="field-error" aria-live="polite"></p>
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="password">Mot de passe</label>
              <a href="/reset">Mot de passe oublié ?</a>
            </div>
            <div className="input-shell">
              <i className="fa-solid fa-lock" aria-hidden="true"></i>
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                placeholder="Votre mot de passe"
                minLength={4}
                required
                aria-describedby="passwordError"
              />
              <button
                className="password-toggle"
                type="button"
                aria-controls="password"
                aria-label="Afficher le mot de passe"
              >
                <i className="fa-regular fa-eye" aria-hidden="true"></i>
              </button>
            </div>
            <p
              id="passwordError"
              className="field-error"
              aria-live="polite"
            ></p>
          </div>

          <p id="formError" className="form-error" role="alert"></p>

          <button className="login-submit" type="submit">
            <span>Se connecter</span>
            <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </button>
        </form>
      </section>
    </main>
  );
}
