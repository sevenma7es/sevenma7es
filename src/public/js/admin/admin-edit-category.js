$("#name").on("change", function () {
  let name = $(this).val();

  let processedName = name.replace(/[^a-zA-Z0-9]+/g, "-");
  processedName = processedName.replace(/^-+|-+$/g, "");

  $("#slug").val(processedName.replace(/-+$/, ""));
});

$("#slug").noSpace({});
$(".property-values ").noSpace({ replaceWith: "," });

const id = $("#id").val();
const parent_id = $("#parent_id").val();

$("#new-parent-id").find(`option[id="${id}"]`).remove();
$("#new-parent-id").find(`option[id="${parent_id}"]`).attr("selected", true);

$("#add-property-button").click(function () {
  const propertyDiv = $("<div>", {
    class: "property-item grid gap-4 sm:grid-cols-2 sm:gap-6 mt-4",
  });

  const nameInput = $("<input>", {
    type: "text",
    name: "property-name",
    placeholder: "Nombre de la propiedad",
    class: "bg-[var(--main-light-1)] border border-gray-300 text-[var(--main-text-light)] text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[var(--main-dark-3)] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500",
    required: "true",
  });

  const valuesInput = $("<input>", {
    type: "text",
    name: "property-values",
    placeholder: "Valores",
    class: "property-values bg-[var(--main-light-1)] border border-gray-300 text-[var(--main-text-light)] text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[var(--main-dark-3)] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500",
    required: "true",
  });

  propertyDiv.append(nameInput, valuesInput);
  $("#properties-container").append(propertyDiv);

  $(".property-values ").noSpace({ replaceWith: "," });
});

$("#category-form").on("submit", function (e) {
  e.preventDefault();

  let required_flag = $(this).validateForm();
  if (required_flag) {
    $("#required_message").removeClass("hidden").addClass("flex");
  } else {
    const properties = [];
    $(".property-item").each(function () {
      const name = $(this).find('input[name="property-name"]').val();
      const values = $(this).find('input[name="property-values"]').val().split(",");
      properties.push({ name, values });
    });

    // $("<input>", {
    //   type: "hidden",
    //   name: "properties",
    //   value: properties,
    // }).appendTo("#category-form");

    const formElement = $(this)[0];
    const formData = new FormData(formElement);
    const obj = {};
    formData.forEach((value, key) => {
      obj[key] = value;
    });

    // properties.forEach((prop) => {
    //   obj[prop.name] = prop.values;
    // });

    obj.properties = properties;

    obj.parent = obj["new-parent-id"];
    delete obj["new-parent-id"];
    delete obj["parent_id"];
    delete obj["property-name"];
    delete obj["property-values"];

    fetch("/api/admin/categories", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then(async (response) => {
        console.log("Response status:", response.status);
        if (!response.ok) {
          const data = await response.json();
          console.error("Response data:", data);
          throw new Error(data.error || "Unknown error");
        }
        return response.json();
      })
      .then((data) => {
        window.location.href = "/admin/categorias";
      })
      .catch((error) => {
        console.error("Error al agregar el categoría:", error.message);
        alert(error.message);
      });
  }
});
