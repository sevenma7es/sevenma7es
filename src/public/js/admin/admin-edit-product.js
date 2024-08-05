$("#title").on("change", function () {
  let title = $(this).val();

  let processedTitle = title.replace(/[^a-zA-Z0-9]+/g, "-");
  processedTitle = processedTitle.replace(/^-+|-+$/g, "");

  $("#slug").val(processedTitle.replace(/-+$/, ""));
});

$("#slug").on("input", function () {
  $(this).val(function (index, value) {
    return value.replace(/\s+/g, "-");
  });
});

let currentCategory = $("#current_category").val();
$("#category").find(`option#${currentCategory}`).attr("selected", true);

const customFileList = [];
$("#dropzone-file").on("change", function () {
  const files = this.files;
  for (let i = 0; i < files.length; i++) {
    customFileList.push(files[i]);
  }
  displayImages(customFileList);
});

function displayImages(files) {
  $("#image-preview").empty();
  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.classList.add("h-32", "w-32", "object-cover", "mr-2", "mb-2");
      $("#image-preview").append(img);
    };
    reader.readAsDataURL(files[i]);
  }
}

$(".delete-image-button").on("click", async function (event) {
  const imagePath = $(this).data("imagePath");

  try {
    const response = await fetch("/api/admin/products/image/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imagePath }),
    });

    const result = await response.json();

    if (response.ok) {
      $(this).closest(".relative").remove();
      console.log(result.message);
    } else {
      console.error(result.message);
    }
  } catch (error) {
    console.error("Error deleting image:", error);
  }
});

$("#product-form").on("submit", function (e) {
  e.preventDefault();

  let required_flag = false;
  required_flag = $("#product-form").validateForm();

  if (required_flag) {
    $("#required_message").removeClass("hidden").addClass("flex");
  } else {
    const formData = new FormData();
    formData.append("id", $("#product-form").attr("reg_id"));
    formData.append("title", $("#title").val());
    formData.append("slug", $("#slug").val());
    formData.append("publishedOn", $("#publishedOn").val());
    formData.append("brand", $("#brand").val());
    formData.append("price", $("#price").val());
    formData.append("category", $("#category").val());
    formData.append("stock", $("#stock").val());
    formData.append("featured", $("#featured").is(":checked"));
    formData.append("description", $("#description").val());
    formData.append("_status", "active");

    for (let i = 0; i < customFileList.length; i++) {
      formData.append("productImages", customFileList[i]);
    }

    fetch("/api/admin/products", {
      method: "PUT",
      body: formData,
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json();
          throw data;
        }
      })
      .then((data) => {
        window.location.href = "/admin/productos";
      })
      .catch((error) => {
        console.error("Error al agregar el producto:", error.message);
        alert(error.message);
      });
  }
});
