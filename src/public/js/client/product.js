import { addToCart } from "../functions.js";

let totalSlides = document.querySelectorAll(".nav-for-slider .swiper-slide").length;

let slidesPerView = totalSlides < 5 ? totalSlides : 5;

let swiperThumbs = new Swiper(".nav-for-slider", {
  loop: totalSlides >= slidesPerView,
  spaceBetween: 10,
  slidesPerView: slidesPerView,
  freeMode: true,
  watchSlidesProgress: true,
});

let swiperMain = new Swiper(".main-slide-carousel", {
  loop: totalSlides >= slidesPerView,
  spaceBetween: 10,
  thumbs: {
    swiper: swiperThumbs,
  },
});

$("#removeOne").on("click", function () {
  let quantity = Number($("#quantity").val());
  if ($("#quantity").val() > 1) {
    $("#quantity").val(quantity - 1);
  }
});

$("#addOne").on("click", function () {
  let quantity = Number($("#quantity").val());
  $("#quantity").val(quantity + 1);
});

$("#addToCart").click(function (e) {
  e.preventDefault();
  e.stopPropagation();
  const productId = $(this).attr("data-product-id");
  if (productId) {
    addToCart(productId, Number($("#quantity").val()));

    $("#quantity").val(1);
  }
});
