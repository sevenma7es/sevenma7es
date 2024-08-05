$(document).ready(function () {
  $("#logout").click(function () {
    fetch("/api/admin/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        const status = res.status;
        if (status === 200) {
          window.location.replace("/admin/login");
        } else {
          console.error("Error de red:", res.status);
        }
      })
      .catch((error) => console.error("Error:", error));
  });
});
