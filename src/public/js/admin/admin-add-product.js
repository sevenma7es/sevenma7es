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

function removeImage(index) {
  customFileList.splice(index, 1); // Eliminar la imagen del array
  displayImages(customFileList); // Volver a mostrar las imágenes restantes
}

// $("#dropzone-file").on("change", function () {
//   const files = this.files;
//   for (let i = 0; i < files.length; i++) {
//     customFileList.push(files[i]);
//   }
//   displayImages(customFileList);
// });

// function displayImages(files) {
//   $("#image-preview").empty();
//   for (let i = 0; i < files.length; i++) {
//     const reader = new FileReader();
//     reader.onload = function (e) {
//       const img = document.createElement("img");
//       img.src = e.target.result;
//       img.classList.add("h-32", "w-32", "object-cover", "mr-2", "mb-2");
//       $("#image-preview").append(img);
//     };
//     reader.readAsDataURL(files[i]);
//   }
// }
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
      const imgWrapper = document.createElement("div");
      imgWrapper.classList.add("relative", "mr-2", "mb-2");

      const img = document.createElement("img");
      img.src = e.target.result;
      img.classList.add("h-100", "w-100", "object-cover");

      const removeButton = document.createElement("button");
      removeButton.classList.add(
        "absolute",
        "top-0",
        "right-0",
        "bg-red-500",
        "text-white",
        "flex",
        "items-center",
        "justify-center",
        "hover:bg-red-700",
        "w-8",
        "h-8",
        "leading-none"
      );
      removeButton.onclick = function () {
        removeImage(i);
      };

      // Create the SVG element
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("xmlns", svgNS);
      svg.setAttribute("width", "24");
      svg.setAttribute("height", "24");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("fill", "none");
      svg.setAttribute("stroke", "currentColor");
      svg.setAttribute("stroke-width", "2");
      svg.setAttribute("stroke-linecap", "round");
      svg.setAttribute("stroke-linejoin", "round");
      svg.classList.add("lucide", "lucide-x");

      const path1 = document.createElementNS(svgNS, "path");
      path1.setAttribute("d", "M18 6 6 18");

      const path2 = document.createElementNS(svgNS, "path");
      path2.setAttribute("d", "m6 6 12 12");

      // Append the paths to the SVG
      svg.appendChild(path1);
      svg.appendChild(path2);

      // Append the SVG to the button
      removeButton.appendChild(svg);

      imgWrapper.appendChild(img);
      imgWrapper.appendChild(removeButton);
      $("#image-preview").append(imgWrapper);
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
