import { toast } from "../functions.js";
isVATPayer_handler();
$("#vatCategory").on("change", function () {
  isVATPayer_handler();
});

function isVATPayer_handler() {
  if ($("#vatCategory").val() === "La empresa no es contribuyente de IVA") {
    $("#isVATPayer").prop("checked", false);
  } else {
    $("#isVATPayer").prop("checked", true);
  }
}

$("#update-enterprise-button").on("click", function (event) {
  event.preventDefault();

  const formData = $("#enterprise-form").serializeArray();
  const enterpriseData = {};

  // Convert form data to JSON object
  $.each(formData, function (_, kv) {
    enterpriseData[kv.name] = kv.value;
  });

  enterpriseData.isVATPayer = $("#isVATPayer").is(":checked");

  const url = "/api/admin/enterprise";
  let method = "POST";

  const enterpriseId = $("#_id").val();
  if (enterpriseId) {
    method = "PUT";
  }

  // Send AJAX request
  $.ajax({
    url: url,
    type: method,
    contentType: "application/json",
    data: JSON.stringify(enterpriseData),
    success: function (response) {
      console.log("Enterprise saved:", response);
      toast({ status: "success", message: "Empresa guardada con éxito." });
    },
    error: function (xhr, status, error) {
      console.error("Error saving enterprise:", error);
      toast({ status: "error", message: "Error al guardar los datos de la empresa." });
    },
  });
});
