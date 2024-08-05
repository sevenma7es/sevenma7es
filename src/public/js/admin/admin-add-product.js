$("#title").on("change", function () {
  let title = $(this).val();

  let processedTitle = title.replace(/[^a-zA-Z0-9]+/g, "-");
  processedTitle = processedTitle.replace(/^-+|-+$/g, "");

  $("#slug").val(processedTitle.replace(/-+$/, ""));
});

const date = new Date();
const formattedDate = date.toISOString().split("T")[0];
$("#publishedOn").val(formattedDate);

$("#slug").noSpace();

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

$("#add-product-button").on("click", function (e) {
  e.preventDefault();
  let required_flag = $("#product-form").validateForm();

  if (required_flag) {
    $("#required_message").removeClass("hidden").addClass("flex");
  } else {
    const formData = new FormData();
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
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json();
          throw data;
        }
        return response.json();
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
