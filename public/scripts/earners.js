"use strict";
const addEarnerDialog = document.getElementById("addEarnerDialog");
const addEarnerForm = document.getElementById("addEarnerForm");
addEarnerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(addEarnerForm);
    const resp = await fetch("http://localhost:3000/api/v1/earners", {
        method: "POST",
        body: new URLSearchParams(formData),
    });
    const data = await resp.json();
    if (data.success) {
        addEarnerForm.reset();
        window.location.reload();
    }
    if (data.code === 500) {
        alert("Internal Server Error");
    }
    console.log(data.error.message);
});
let earnerID = "";
const earnerActionPopoverBtns = document.querySelectorAll("button.showActionPopoverBtn");
earnerActionPopoverBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        const value = btn.dataset["id"];
        if (value === undefined)
            return;
        earnerID = value;
    });
});
const editEarnerBtn = document.getElementById("editEarnerBtn");
editEarnerBtn.addEventListener("click", async () => {
    const resp = await fetch(`http://localhost:3000/api/v1/edit/earner?id=${earnerID}`);
    const data = await resp.text();
    const dialogID = "editEarnerDialog";
    let dialog = document.getElementById(dialogID);
    if (dialog === null) {
        dialog = document.createElement("dialog");
        dialog.id = dialogID;
        document.body.appendChild(dialog);
    }
    dialog.innerHTML = data;
    dialog.showModal();
    const editEarnerForm = dialog.querySelector("#editEarnerForm");
    editEarnerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(editEarnerForm);
        const resp = await fetch(`/api/v1/earners?id=${earnerID}`, {
            method: "PUT",
            body: new URLSearchParams(formData),
        });
        const data = await resp.json();
        console.log(data);
    });
});
