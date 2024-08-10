import { toast } from "../functions.js";

$("#client-home-config").hidePanel({
  id_container: "client-home-config-container",
  title: "Home Page",
  button_id: "button_home_config",
  open: false,
});

$("#client-footer-config").hidePanel({
  id_container: "client-footer-config-container",
  title: "Footer",
  button_id: "button_footer_config",
  open: false,
});

$("#submitHomeChanges").on("click", function () {
  const inputs = $("#client-home-config input");
  const body = {};

  inputs.each(function () {
    body[$(this).attr("id")] = $(this).val();
  });

  const url = "/api/admin/settings";
  let method = "POST";

  const settingsId = $("#_id").val();

  body._id = settingsId;

  if (settingsId) {
    method = "PUT";
  }

  fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      $("#_id").val(data._id);
      toast({ status: "success", message: "Configuración guardada con éxito." });
    })
    .catch((error) => {
      console.error("Error saving settings:", error);
      toast({ status: "error", message: "Error al guardar los datos de la configuración." });
    });
});

$("#submitFooterChanges").on("click", function () {
  const inputs = $("#client-footer-config input");
  const body = {};

  inputs.each(function () {
    body[$(this).attr("id")] = $(this).val();
  });

  const url = "/api/admin/settings";
  let method = "POST";

  const settingsId = $("#_id").val();

  body._id = settingsId;

  if (settingsId) {
    method = "PUT";
  }

  fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      $("#_id").val(data._id);
      toast({ status: "success", message: "Configuración guardada con éxito." });
    })
    .catch((error) => {
      console.error("Error saving settings:", error);
      toast({ status: "error", message: "Error al guardar los datos de la configuración." });
    });
});
