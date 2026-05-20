export default function Reset() {
  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="reset-title">
        <div className="login-brand">
          <div>
            <p className="login-eyebrow">Sécurité du compte</p>
            <h1 id="reset-title">Réinitialiser le mot de passe</h1>
          </div>
        </div>

        <form id="resetPasswordForm" className="login-form" noValidate>
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
            <label htmlFor="password">Nouveau mot de passe</label>
            <div className="input-shell">
              <i className="fa-solid fa-lock" aria-hidden="true"></i>
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="new-password"
                placeholder="Nouveau mot de passe"
                minLength={8}
                required
                aria-describedby="passwordError passwordHelp"
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
            <p id="passwordHelp" className="field-help">
              8 caractères minimum, avec une majuscule, une minuscule et un
              chiffre.
            </p>
            <p
              id="passwordError"
              className="field-error"
              aria-live="polite"
            ></p>
          </div>

          <div className="form-group">
            <label htmlFor="confirm_password">Confirmer le mot de passe</label>
            <div className="input-shell">
              <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
              <input
                type="password"
                name="confirm_password"
                id="confirm_password"
                autoComplete="new-password"
                placeholder="Confirmez le mot de passe"
                minLength={8}
                required
                aria-describedby="confirmPasswordError"
              />
            </div>
            <p
              id="confirmPasswordError"
              className="field-error"
              aria-live="polite"
            ></p>
          </div>

          <p id="formError" className="form-error" role="alert"></p>

          <button className="login-submit" type="submit">
            <span>Réinitialiser</span>
            <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </button>

          <a className="form-link" href="/login">
            Retour à la connexion
          </a>
        </form>
      </section>
    </main>
  );
}
