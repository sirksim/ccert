const addUserDialog = document.getElementById(
  "addUserDialog",
) as HTMLDialogElement;
const addUserForm = document.getElementById("addUserForm") as HTMLFormElement;

addUserForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(addUserForm);
  const submitBtn = addUserForm.querySelector("button")!;
  submitBtn.disabled = true;
  try {
    const resp = await fetch("http://localhost:3000/api/v1/users", {
      method: "post",
      body: new URLSearchParams(formData as any),
    });
    const data = await resp.json();
    console.log(data);
    if (!data.success) {
      const parts = data.error.message.split(".");
      const fieldName = parts[1];
      console.log(parts);
      const field = addUserForm.querySelector(
        `input[id=${fieldName}]`,
      ) as HTMLInputElement;
      const p = field.nextElementSibling!;
      p.textContent = "Email already exist";
      field.focus();
    }
  } catch (e) {
    console.log(e);
  } finally {
    submitBtn.disabled = false;
  }
});
