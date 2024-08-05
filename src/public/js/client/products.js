import { addToCart } from "../functions.js";

$("#product-open-sidebar").on("click", () => {
  $("#product-default-sidebar").removeClass("-translate-x-full");
});

$("#product-close-aside-button").on("click", () => {
  $("#product-default-sidebar").addClass("-translate-x-full");
});

document.getElementById("Offer").addEventListener("change", function () {
  const sort = this.value;
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set("sort", sort);
  urlParams.set("page", 1); // Reiniciar a la primera página cuando se cambia el ordenamiento
  window.location.search = urlParams.toString();
});

$("#categories-select-button").on("click", function () {
  $("#categories-select-container").toggleClass("hidden");
});

$(document).on("click", function () {
  $("#categories-select-container").addClass("hidden");
});

let category_selected_slug = $("#categories-select-button").attr("category-selected-slug");

if (category_selected_slug) {
  $("#categories-select-container").find(`li[category-slug=${category_selected_slug}]`).append(`
    <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--main-dark-1)]">
      <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd"
          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
          clip-rule="evenodd" />
      </svg>
    </span>
  `);
}

$("#buttonSearchForm").on("click", function (event) {
  event.preventDefault();
  const keywords = $("#productsSearchInput").val().trim();

  if (keywords) {
    const encodedKeywords = encodeURIComponent(keywords);
    window.location.href = `/productos/buscar/${encodedKeywords}`;
  }
});

$("button").click(function (e) {
  e.preventDefault();
  e.stopPropagation();
  const productId = $(this).attr("data-product-id");
  if (productId) {
    addToCart(productId);
  }
});
