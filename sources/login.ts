const loginForm = document.getElementById("loginForm") as HTMLFormElement;

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const submitBtn = loginForm.querySelector("button")!;
  try {
    submitBtn.disabled = true;
    const resp = await fetch("http://localhost:3000/api/v1/login", {
      method: "post",
      body: new URLSearchParams(formData as any),
    });
    const data = await resp.json();
    if (data.success) {
      window.location.replace("/");
    }
    if (!data.success) {
      alert(data.error);
    }
    console.log(data);
  } catch (e) {
    console.log(e);
  } finally {
    submitBtn.disabled = false;
  }
});
