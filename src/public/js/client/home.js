import { addToCart } from "../functions.js";

$(document).ready(function () {
  // $("#carousel-container").simpleCarousel({
  //   classes: "relative h-[30vh] md:h-[60vh]",
  //   items: ["https://images.unsplash.com/photo-1674506458432-ed0c0077032d?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "https://images.unsplash.com/photo-1544240841-280e8f840f4b?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "https://images.unsplash.com/photo-1444157545135-c045be691b05?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
  // });

  // Carousel functionality
  let currentIndex = 0;
  let itemsCount = 4;

  function goToSlide(index) {
    $("#carousel-wrapper").children("div").removeClass("active").addClass("hidden");
    $("#carousel-wrapper").children("div").eq(index).removeClass("hidden").addClass("active");
    $("#indicators").children("button").attr("aria-current", "false");
    $("#indicators").children("button").eq(index).attr("aria-current", "true");
  }

  $("#prev-button").on("click", function () {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : itemsCount - 1;
    goToSlide(currentIndex);
  });

  $("#next-button").on("click", function () {
    currentIndex = currentIndex < itemsCount - 1 ? currentIndex + 1 : 0;
    goToSlide(currentIndex);
  });

  $("#indicators").find("button").on("click", function () {
    var index = $(this).attr("data-carousel-slide-to");
    currentIndex = index;
    goToSlide(currentIndex);
  });

  // Initialize first slide
  goToSlide(currentIndex);

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
