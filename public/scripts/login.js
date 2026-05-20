"use strict";

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const formError = document.getElementById("formError");
const submitBtn = loginForm?.querySelector("button[type='submit']");
const passwordToggle = loginForm?.querySelector(".password-toggle");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const setFieldError = (input, errorElement, message) => {
  input.setAttribute("aria-invalid", message ? "true" : "false");
  errorElement.textContent = message;
};

const clearFormError = () => {
  formError.textContent = "";
};

const getEmailError = () => {
  const email = emailInput.value.trim();

  if (email.length === 0) {
    return "L'adresse email est obligatoire.";
  }

  if (!emailPattern.test(email)) {
    return "Entrez une adresse email valide.";
  }

  return "";
};

const getPasswordError = () => {
  const password = passwordInput.value;

  if (password.length === 0) {
    return "Le mot de passe est obligatoire.";
  }

  if (password.length < 4) {
    return "Le mot de passe doit contenir au moins 4 caractères.";
  }

  return "";
};

const validateLoginForm = () => {
  const emailMessage = getEmailError();
  const passwordMessage = getPasswordError();

  setFieldError(emailInput, emailError, emailMessage);
  setFieldError(passwordInput, passwordError, passwordMessage);

  return !emailMessage && !passwordMessage;
};

const setLoading = (loading) => {
  submitBtn.disabled = loading;
  submitBtn.querySelector("span").textContent = loading
    ? "Connexion..."
    : "Se connecter";
};

emailInput.addEventListener("input", () => {
  clearFormError();
  setFieldError(emailInput, emailError, getEmailError());
});

passwordInput.addEventListener("input", () => {
  clearFormError();
  setFieldError(passwordInput, passwordError, getPasswordError());
});

passwordToggle.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  passwordToggle.setAttribute(
    "aria-label",
    isHidden ? "Masquer le mot de passe" : "Afficher le mot de passe",
  );
  passwordToggle.querySelector("i").className = isHidden
    ? "fa-regular fa-eye-slash"
    : "fa-regular fa-eye";
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearFormError();

  if (!validateLoginForm()) {
    return;
  }

  const formData = new FormData(loginForm);

  try {
    setLoading(true);

    const resp = await fetch("/api/v1/login", {
      method: "POST",
      body: new URLSearchParams(formData),
      headers: {
        Accept: "application/json",
      },
    });

    let data = { success: false, error: "Réponse du serveur invalide." };

    try {
      data = await resp.json();
    } catch {
      // Keep the fallback message above.
    }

    if (resp.ok && data.success) {
      window.location.replace("/");
      return;
    }

    formError.textContent =
      typeof data.error === "string"
        ? data.error
        : "Identifiants invalides. Vérifiez votre email et votre mot de passe.";
  } catch {
    formError.textContent =
      "Impossible de contacter le serveur. Vérifiez votre connexion puis réessayez.";
  } finally {
    setLoading(false);
  }
});
