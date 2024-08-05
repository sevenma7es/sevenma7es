import { isValidEmail } from "../functions.js";
const registerForm = $("#registerForm");

$("#submit-register").prop("disabled", true).css({
  opacity: 0.5,
  cursor: "not-allowed",
});

$("#full_name, #email, #password, #password-repeated").on(
  "input propertychanges",
  function () {
    const fullName = $("#full_name").val();
    const email = $("#email").val();
    const password = $("#password").val();
    const passwordRepeated = $("#password-repeated").val();

    const valid_email = isValidEmail(email);

    if (password === passwordRepeated && fullName !== "" && valid_email) {
      $("#submit-register").prop("disabled", false).css({
        opacity: 1,
        cursor: "pointer",
      });
    } else {
      $("#submit-register").prop("disabled", true).css({
        opacity: 0.5,
        cursor: "not-allowed",
      });
    }
  }
);

registerForm.on("submit", function (event) {
  event.preventDefault();
  event.stopPropagation();

  const formElement = registerForm[0];
  const formData = new FormData(formElement);

  $("#submit").prop("disabled", true);

  let obj = {};
  formData.forEach((value, key) => (obj[key] = value));

  obj = { ...obj, roles: ["admin"] };

  fetch("/api/admin/sessions/register", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.status === 200) {
        window.location.replace("/admin/login");
      } else {
        res.json().then((data) => {
          console.error("Registration failed:", data);
        });
      }
    })
    .catch((error) => console.error("Error:", error));
});
