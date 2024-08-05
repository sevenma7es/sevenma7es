import { checkUserLoggedIn, loadScripts } from "../functions.js";
loadScripts("client");

$("#burger-button").on("click", function () {
  $("#mobile-navbar").removeClass("-translate-x-full");
});

$("#close-mobile-navbar").on("click", function () {
  $("#mobile-navbar").addClass("-translate-x-full");
});

$("#toggle-dark-mode, #aside-toggle-dark-mode").on("click", () => {
  const htmlElement = document.documentElement;
  const currentMode = htmlElement.getAttribute("data-mode");
  const newMode = currentMode === "light" ? "dark" : "light";
  htmlElement.setAttribute("data-mode", newMode);
  localStorage.setItem("theme", newMode); // Toggle icons
  $("#toggle-icon-moon").toggleClass("hidden");
  $("#toggle-icon-sun").toggleClass("hidden");
  $("#aside-toggle-icon-moon").toggleClass("hidden");
  $("#aside-toggle-icon-sun").toggleClass("hidden");
});
$(document).ready(() => {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-mode", savedTheme);
  if (savedTheme === "dark") {
    $("#toggle-icon-moon").addClass("hidden");
    $("#toggle-icon-sun").removeClass("hidden");
    $("#aside-toggle-icon-moon").addClass("hidden");
    $("#aside-toggle-icon-sun").removeClass("hidden");
  } else {
    $("#toggle-icon-moon").removeClass("hidden");
    $("#toggle-icon-sun").addClass("hidden");
    $("#aside-toggle-icon-moon").removeClass("hidden");
    $("#aside-toggle-icon-sun").addClass("hidden");
  }
});

$("#logout, #logout-sidebar").click(function () {
  fetch("/api/client/sessions/logout", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      const status = res.status;
      if (status === 200) {
        localStorage.removeItem("userId");
        window.location.replace("/");
      } else {
        console.error("Error de red:", res.status);
      }
    })
    .catch((error) => console.error("Error:", error));
});

$("#user_dropdown_button").on("click", function () {
  $("#user_dropdown").toggleClass("hidden");
});

checkUserLoggedIn();
setInterval(checkUserLoggedIn, 300000);
