"use strict";
const addUserDialog = document.getElementById("addUserDialog");
const addUserForm = document.getElementById("addUserForm");
addUserForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(addUserForm);
    const submitBtn = addUserForm.querySelector("button");
    submitBtn.disabled = true;
    try {
        const resp = await fetch("http://localhost:3000/api/v1/users", {
            method: "post",
            body: new URLSearchParams(formData),
        });
        const data = await resp.json();
        console.log(data);
        if (data.success) {
            addUserDialog.close();
            addUserForm.reset();
            window.location.reload();
            return;
        }
        const parts = data.error.message.split(".");
        const fieldName = parts[1];
        console.log(parts);
        const field = addUserForm.querySelector(`input[id=${fieldName}]`);
        const p = field.nextElementSibling;
        p.textContent = "Email already exist";
        field.focus();
    }
    catch (e) {
        console.log(e);
    }
    finally {
        submitBtn.disabled = false;
    }
});
let userID = "";
const userActionPopoverBtns = document.querySelectorAll("button.showActionPopoverBtn");
userActionPopoverBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        const value = btn.dataset["id"];
        if (value === undefined)
            return;
        userID = value;
    });
});
const editUserBtn = document.getElementById("editUserBtn");
editUserBtn.addEventListener("click", async () => {
    const resp = await fetch(`http://localhost:3000/api/v1/edit/user?id=${userID}`);
    const data = await resp.text();
    console.log(data);
    const dialogID = "editUserDialog";
    if (document.getElementById(dialogID) === null) {
        const dialog = document.createElement("dialog");
        dialog.id = dialogID;
        dialog.innerHTML = data;
        document.body.appendChild(dialog);
        dialog.showModal();
    }
    const dialog = document.getElementById(dialogID);
    dialog.innerHTML = data;
    dialog.showModal();
});
