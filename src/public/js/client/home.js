import { addToCart } from "../functions.js";

$(document).ready(function () {
  $("#carousel-container").simpleCarousel({
    classes: "relative h-[30vh] md:h-[60vh]",
    items: ["images/home/home-carrousel-1.jpg", "images/home/home-carrousel-2.png", "images/home/home-carrousel-3.png"],
  });

  $("button.addToCart").click(function () {
    const productId = $(this).attr("data-product-id");
    if (productId) {
      addToCart(productId);
    }
  });

  $("#buttonSearchForm").on("click", function (event) {
    event.preventDefault();
    const keywords = $("#productsSearchInput").val().trim();

    if (keywords) {
      const encodedKeywords = encodeURIComponent(keywords);
      window.location.href = `/productos/buscar/${encodedKeywords}`;
    }
  });
});
