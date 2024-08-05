import { isValidEmail } from "../functions.js";
const loginForm = $("#loginForm");

$("#submit").prop("disabled", true).css({
  opacity: 0.5,
  cursor: "not-allowed",
});

$("#password, #email").on("input propertychanges", function () {
  const email = $("#email").val();
  const password = $("#password").val();

  const valid_email = isValidEmail(email);

  if (password !== "" && valid_email) {
    $("#submit").prop("disabled", false).css({
      opacity: 1,
      cursor: "pointer",
    });
  } else {
    $("#submit").prop("disabled", true).css({
      opacity: 0.5,
      cursor: "not-allowed",
    });
  }
});

const email = localStorage.getItem("email");
if (email) {
  $("#email").val(email);
  $("#remember").prop("checked", true);
} else {
  $("#remember").prop("checked", false);
}

loginForm.on("submit", function (event) {
  event.preventDefault();
  event.stopPropagation();

  $("#submit").prop("disabled", true);

  const formElement = loginForm[0];
  const formData = new FormData(formElement);
  const obj = {};
  formData.forEach((value, key) => {
    obj[key] = value;
  });

  if ($("#remember").prop("checked") === true) {
    localStorage.setItem("email", obj.email);
  } else {
    localStorage.removeItem("email");
  }

  fetch("/api/client/sessions/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        // Elimino por las dudas el userId.
        localStorage.removeItem("userId");

        localStorage.setItem("userId", data.user._id);
        window.location.replace("/");
      } else {
        $("#submit").prop("disabled", false).css({
          opacity: 1,
          cursor: "pointer",
        });

        switch (data.action) {
          case "redirect":
            window.location.replace("/client/login-fail");
            break;
          default:
            $("#warning_message")
              .removeClass("opacity-0")
              .addClass("opacity-100");
            $("#password").val("").addClass("input-tiene-error");
            break;
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An unexpected error occurred. Please try again later.");
      $("#submit").prop("disabled", false).css({
        opacity: 1,
        cursor: "pointer",
      });
    });
});
