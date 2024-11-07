let addBtn = document.getElementById("addButton");
addBtn.addEventListener("click", () => {
  let num1 = document.getElementById("num1").value;
  let num2 = document.getElementById("num2").value;
  let result = document.getElementById("result");

  let sum = parseFloat(num1) + parseFloat(num2);
  result.innerHTML = `<i class='fas fa-equals icon'>${sum}</i>`;
});
