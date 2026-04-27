const addEarnerDialog = document.getElementById(
  "addEarnerDialog",
) as HTMLDialogElement;
const addEarnerForm = document.getElementById(
  "addEarnerForm",
) as HTMLFormElement;

addEarnerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(addEarnerForm);
  const resp = await fetch("http://localhost:3000/api/v1/earners", {
    method: "POST",
    body: new URLSearchParams(formData as any),
  });
  const data = await resp.json();
  console.log(data);
});
