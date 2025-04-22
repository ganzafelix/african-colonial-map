const buttons = document.querySelectorAll(".colonizer-buttons button");
const map = document.getElementById("map");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    // Remove "active" from all buttons
    buttons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    // Get which map to show
    const mapKey = button.getAttribute("data-map");
    map.setAttribute("src", `static/maps/${mapKey}.png`);
    map.setAttribute("alt", `${mapKey} colonization map`);
  });
});