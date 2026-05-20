"use strict";

const resetForm = document.getElementById("resetPasswordForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm_password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");
const formError = document.getElementById("formError");
const submitBtn = resetForm?.querySelector("button[type='submit']");
const passwordToggle = resetForm?.querySelector(".password-toggle");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const setFieldError = (input, errorElement, message) => {
  input.setAttribute("aria-invalid", message ? "true" : "false");
  errorElement.textContent = message;
};

const clearFormError = () => {
  formError.textContent = "";
  formError.classList.remove("form-success");
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

  if (password.length < 8) {
    return "Le mot de passe doit contenir au moins 8 caractères.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Le mot de passe doit contenir au moins une majuscule.";
  }

  if (!/[a-z]/.test(password)) {
    return "Le mot de passe doit contenir au moins une minuscule.";
  }

  if (!/[0-9]/.test(password)) {
    return "Le mot de passe doit contenir au moins un chiffre.";
  }

  return "";
};

const getConfirmPasswordError = () => {
  if (confirmPasswordInput.value.length === 0) {
    return "Confirmez le mot de passe.";
  }

  if (confirmPasswordInput.value !== passwordInput.value) {
    return "Les mots de passe ne correspondent pas.";
  }

  return "";
};

const validateResetForm = () => {
  const emailMessage = getEmailError();
  const passwordMessage = getPasswordError();
  const confirmPasswordMessage = getConfirmPasswordError();

  setFieldError(emailInput, emailError, emailMessage);
  setFieldError(passwordInput, passwordError, passwordMessage);
  setFieldError(
    confirmPasswordInput,
    confirmPasswordError,
    confirmPasswordMessage,
  );

  return !emailMessage && !passwordMessage && !confirmPasswordMessage;
};

const setLoading = (loading) => {
  submitBtn.disabled = loading;
  submitBtn.querySelector("span").textContent = loading
    ? "Réinitialisation..."
    : "Réinitialiser";
};

[emailInput, passwordInput, confirmPasswordInput].forEach((input) => {
  input.addEventListener("input", () => {
    clearFormError();
    validateResetForm();
  });
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

resetForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearFormError();

  if (!validateResetForm()) {
    return;
  }

  const formData = new FormData(resetForm);

  try {
    setLoading(true);

    const resp = await fetch("/api/v1/reset-password", {
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
      formError.classList.add("form-success");
      formError.textContent =
        "Votre mot de passe a été réinitialisé. Vous pouvez maintenant vous connecter.";
      resetForm.reset();
      return;
    }

    formError.textContent =
      typeof data.error === "string"
        ? data.error
        : "Impossible de réinitialiser le mot de passe.";
  } catch {
    formError.textContent =
      "Impossible de contacter le serveur. Vérifiez votre connexion puis réessayez.";
  } finally {
    setLoading(false);
  }
});
