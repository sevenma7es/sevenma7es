$("#categorySearchDropdown").dropdown({
  title: "Nombre",
  items: [
    {
      title: "Nombre",
      id: "name",
    },
  ],
  defaultSearch: "name",
});

function searchCategory() {
  const findBy = $("#categorySearchDropdown").attr("findBy");
  const query = $("#searchInput").val();

  fetch(`/api/admin/categories/search?findBy=${findBy}&query=${query}`)
    .then((response) => response.json())
    .then((data) => {
      const tbody = document.getElementById("categories_tbody");
      tbody.innerHTML = "";

      data.categories.forEach((category) => {
        const row = document.createElement("tr");
        row.className = "even:bg-[var(--main-light-1)] even:dark:bg-[var(--main-dark-7)] odd:bg-[var(--main-light-2)] odd:dark:bg-[var(--main-dark-3)] border-b dark:border-[var(--main-dark-10)] cursor-pointer";
        row.id = category.slug;
        row.innerHTML = `
          <td scope="row" class="px-2 py-2 font-medium text-[var(--main-text-light)] whitespace-nowrap dark:text-white">${category.name}</td>
          <td class="px-2 py-2">${category.category || ""}</td>
        `;
        tbody.appendChild(row);
        $("#searchButton").prop("disabled", false);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      $("#searchButton").prop("disabled", false);
    });
}
$("#searchButton").on("click", function (e) {
  e.preventDefault();
  $(this).prop("disabled", true);
  searchCategory();
});

$("table").contextMenuPlugin({
  menuSelector: "#contextMenu",
  allowDoubleClick: true,
});

$(".edit_button").on("click", function () {
  window.location.replace(`/admin/categories/edit/${$(this).attr("slug")}`);
});
$(".delete_button").on("click", function () {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Estás a punto de borrar este categoría. Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    confirmButtonText: "Borrar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/api/admin/categories/${$(this).attr("id")}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          switch (res.status) {
            case 500:
              alert("Error: " + res.status);
              break;
            case 200:
              window.location.reload();
              break;
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  });
});
