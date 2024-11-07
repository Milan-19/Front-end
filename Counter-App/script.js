const counter = document.getElementById("counter");
const increaseBtn = document.getElementById("increase");
const decreaseBtn = document.getElementById("decrease");
const resetBtn = document.getElementById("reset");

const initialCount = 0;
counter.innerHTML = initialCount;

increaseBtn.addEventListener("click", () => counter.innerHTML++);
decreaseBtn.addEventListener("click", () => counter.innerHTML--);
resetBtn.addEventListener("click", () => (counter.innerHTML = initialCount));
