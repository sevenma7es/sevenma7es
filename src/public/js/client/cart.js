import { cartIsEmpty } from "../components/cart/cartIsEmpty.js";
import { cartItem } from "../components/cart/cartItem.js";
import { cartTotal } from "../components/cart/cartTotal.js";
import { localCartHandler, toast } from "../functions.js";

if (localStorage.getItem("userId")) {
  fetch(`/api/client/carts/${localStorage.getItem("userId")}`)
    .then((response) => response.json())
    .then((data) => {
      $("#total-container").html(cartTotal(data));
      $("#cart-total-spinner-container").hide();

      if (data) {
        const productData = data.products;
        if (productData.length > 0) {
          $("#item-count").text(`${productData.length} Items`);
          productData.forEach(function (product) {
            fetch(`/api/client/products/search?findBy=id&query=${product.id}`)
              .then((response) => response.json())
              .then(async (data) => {
                const productData = data.product;
                productData.quantity = product.quantity;
                const card = await cartItem(productData);
                $("#cards-container").append(card);
                $("#cart-spinner-container").hide();
              })
              .catch((error) => {
                console.error("Error:", error);
                return "";
              });
          });
        } else {
          $("#cards-container").append(cartIsEmpty());
          $("#cart-spinner-container").hide();
        }
      } else {
        $("#cards-container").append(cartIsEmpty());
        $("#cart-spinner-container").hide();
      }

      // Use event delegation for dynamically added elements
      $(document).on("click", ".addOne", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const productId = $(this).attr("data-button");
        increment(productId);
      });

      $(document).on("click", ".removeOne", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const productId = $(this).attr("data-button");
        if (parseInt($(`#quantity-${productId}`).val()) > 1) {
          decrement(productId);
        }
      });

      $(document).on("click", ".deleteButton", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const productId = $(this).attr("data-button");
        deleteProduct(productId);
      });

      function increment(productId) {
        let quantity = parseInt($(`#quantity-${productId}`).val()) + 1;
        $(`#quantity-${productId}`).val(quantity);

        fetch(`/api/client/carts/update-quantity/${productId}`, {
          method: "PUT",
          body: JSON.stringify({ quantity: quantity }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            $("#total-container").html(cartTotal(data.result));
            $("#cart-total-spinner-container").hide();
          });
      }

      function decrement(productId) {
        let quantity = parseInt($(`#quantity-${productId}`).val()) - 1;
        $(`#quantity-${productId}`).val(quantity);

        fetch(`/api/client/carts/update-quantity/${productId}`, {
          method: "PUT",
          body: JSON.stringify({ quantity: quantity }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            $("#total-container").html(cartTotal(data.result));
            $("#cart-total-spinner-container").hide();
          });
      }

      function deleteProduct(productId) {
        fetch(`/api/client/carts/remove-product/${productId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            $(`#product-card-${productId}`).remove();
            if (data.result.products.length < 1) {
              $("#cards-container").append(cartIsEmpty());
              $("#cart-spinner-container").hide();
            }
            $("#total-container").html(cartTotal(data.result));
            $("#cart-total-spinner-container").hide();
          });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      return "";
    });
} else {
  const localCart = JSON.parse(localStorage.getItem("cart"));

  async function getProducts() {
    if (localCart) {
      if (localCart.products.length > 0) {
        async function cartValidation(products) {
          const updatedProducts = [];

          await Promise.all(
            products.map(async (product) => {
              const response = await fetch(`/api/client/products/search?findBy=id&query=${product.id}`);
              const data = await response.json();

              if (data.product == null) {
                const cart = JSON.parse(localStorage.getItem("cart"));

                if (cart && cart.products) {
                  const filteredProducts = cart.products.filter((cartProduct) => cartProduct.id !== product.id);

                  const newTotal = filteredProducts.reduce((total, item) => total + item.price * item.quantity, 0);
                  toast({ status: "info", message: "Uno de los productos en tu carrito ya no está disponible, por lo que se ha eliminado." });

                  cart.products = filteredProducts;
                  cart.total = newTotal;
                  localStorage.setItem("cart", JSON.stringify(cart));
                }
              } else {
                updatedProducts.push(product);
              }
            })
          );
          return updatedProducts;
        }

        (async () => {
          const updatedProducts = await cartValidation(localCart.products);
          $("#item-count").text(`${updatedProducts.length} Items`);
        })();

        const productPromises = localCart.products.map(async (product) => {
          try {
            const response = await fetch(`/api/client/products/search?findBy=id&query=${product.id}`);
            const data = await response.json();
            if (data.product === null) {
              return;
            }

            const productData = data.product;
            productData.quantity = product.quantity;
            return await cartItem(productData);
          } catch (error) {
            console.error("Error:", error);
            return "";
          }
        });

        const products = await Promise.all(productPromises);
        return products.join("");
      } else {
        return cartIsEmpty();
      }
    } else {
      return cartIsEmpty();
    }
  }

  async function refreshCards() {
    const cards = await getProducts();
    $("#cards-container").html(cards);
    $("#cart-spinner-container").hide();
  }

  $(document).ready(async function () {
    await refreshCards();
    const localCart = JSON.parse(localStorage.getItem("cart"));
    $("#total-container").html(cartTotal(localCart));
    $("#cart-total-spinner-container").hide();

    $(`.addOne, .removeOne, .deleteButton`).on("click", async function () {
      const dataId = $(this).attr("data-button");
      const actualQ = parseInt($(`#quantity-${dataId}`).val(), 10);
      if ($(this).hasClass("addOne")) {
        $(`#quantity-${dataId}`).val(actualQ + 1);
        $(`#parcialTotal-${dataId}`).text((actualQ + 1) * parseFloat($(`[data-price-unformatted-${dataId}]`).attr(`data-price-unformatted-${dataId}`)));
        $(`#parcialTotal-${dataId}`).formatCurrency();
        localCartHandler(dataId, "update");
      } else if ($(this).hasClass("removeOne") && actualQ > 1) {
        $(`#quantity-${dataId}`).val(actualQ - 1);
        $(`#parcialTotal-${dataId}`).text((actualQ - 1) * parseFloat($(`[data-price-unformatted-${dataId}]`).attr(`data-price-unformatted-${dataId}`)));
        $(`#parcialTotal-${dataId}`).formatCurrency();
        localCartHandler(dataId, "update");
      } else if ($(this).hasClass("deleteButton")) {
        $(`#product-card-${dataId}`).remove();
        localCartHandler(dataId, "delete");
        toast({ status: "success", message: "Producto eliminado del carrito" });
        const localCart = JSON.parse(localStorage.getItem("cart"));

        if (localCart.products.length <= 0) {
          $("#cards-container").html(cartIsEmpty());
          $("#cart-spinner-container").hide();
        }
        $("#total-container").html(cartTotal(localCart));
        $("#cart-total-spinner-container").hide();
      }
    });
  });
}
