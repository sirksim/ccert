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
    console.log(data);
});
