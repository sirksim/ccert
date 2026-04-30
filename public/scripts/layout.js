"use strict";
const selectOnes = document.querySelectorAll("[name=selectOne]");
const selectAll = document.getElementById("selectAll");
selectOnes.forEach((select) => {
    select.addEventListener("input", handleCheckboxes);
});
selectAll.addEventListener("input", () => {
    selectOnes.forEach((select) => {
        select.checked = selectAll.checked;
    });
});
function handleCheckboxes(_e) {
    const checked = Array.from(selectOnes).filter((x) => x.checked).length;
    if (checked === 0) {
        selectAll.checked = false;
        selectAll.indeterminate = false;
        return;
    }
    if (checked === selectOnes.length) {
        selectAll.indeterminate = false;
        selectAll.checked = true;
        return;
    }
    selectAll.indeterminate = true;
    selectAll.checked = false;
}
