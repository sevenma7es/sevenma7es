$("#productSearchDropdown").dropdown({
  title: "Nombre",
  items: [
    {
      title: "Nombre",
      id: "title",
    },
    {
      title: "Categoría",
      id: "category",
    },
  ],
});

function searchProduct() {
  const findBy = $("#productSearchDropdown").attr("findBy");
  const query = $("#searchInput").val();

  fetch(`/api/admin/products/search?findBy=${findBy}&query=${query}`)
    .then((response) => response.json())
    .then((data) => {
      const tbody = document.getElementById("products_tbody");
      tbody.innerHTML = "";

      data.products.forEach((product) => {
        const row = document.createElement("tr");
        row.className = "even:bg-[var(--main-light-1)] even:dark:bg-[var(--main-dark-7)] odd:bg-[var(--main-light-2)] odd:dark:bg-[var(--main-dark-3)] border-b dark:border-[var(--main-dark-10)] cursor-pointer";
        row.id = product.slug;
        row.innerHTML = `
          <td scope="row" class="px-2 py-2 font-medium text-[var(--main-text-light)] whitespace-nowrap dark:text-white">${product.title}</td>
          <td class="px-2 py-2">${product.category || ""}</td>
          <td class="px-2 py-2">$${product.price}</td>
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
  searchProduct();
});

$("table").contextMenuPlugin({
  menuSelector: "#contextMenu",
  allowDoubleClick: true,
});
