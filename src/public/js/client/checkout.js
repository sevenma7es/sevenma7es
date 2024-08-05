import { toast } from "../functions.js";

fetch("https://apis.datos.gob.ar/georef/api/provincias")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Error al obtener las provincias");
    }
    return response.json();
  })
  .then((data) => {
    $("#select-province-input-3").html('<option value="">Seleccione una provincia</option>');
    const provincias = data.provincias;

    provincias.sort((a, b) => a.nombre.localeCompare(b.nombre));

    provincias.forEach((provincia) => {
      $("#select-province-input-3").append(`<option value="${provincia.id}">${provincia.nombre}</option>`);
    });

    buildMunicipios();
  })
  .catch((error) => {
    console.error("Error al obtener las provincias:", error);
  });

function buildMunicipios() {
  let provinciaId = $("#select-province-input-3").val();

  if (!provinciaId) {
    $("#select-city-input-3").html('<option value="">Seleccione una localidad</option>');
    return;
  }

  fetch(`https://apis.datos.gob.ar/georef/api/municipios?provincia=${provinciaId}&max=1000`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener los municipios");
      }
      return response.json();
    })
    .then((data) => {
      $("#select-city-input-3").html('<option value="">Seleccione una localidad</option>');

      let municipios = data.municipios;

      municipios.sort((a, b) => a.nombre.localeCompare(b.nombre));

      municipios.forEach((municipio) => {
        $("#select-city-input-3").append(`<option value="${municipio.nombre}">${municipio.nombre}</option>`);
      });
    })
    .catch((error) => {
      console.error("Error al obtener los municipios:", error);
    });
}

$("#select-province-input-3").on("change", function () {
  buildMunicipios();
});

$("#whatsapp-payment").show();
$("#mercado-pago-payment").hide();
$("#wallet_container").html("");
$("#mercado-pago-spinner-container").removeClass("hidden").addClass("flex");

$('input[name="payment-method"]').on("click", async function () {
  if (this.id === "whatsapp") {
    $("#whatsapp-payment").show();
    $("#mercado-pago-payment").hide();
    $("#wallet_container").html("");
    $("#mercado-pago-spinner").show();
  } else if (this.id === "mercado-pago") {
    console.log("Opción de Mercado Pago seleccionada");
    $("#whatsapp-payment").hide();
    $("#mercado-pago-payment").show();
    // Mercado Pago:
    const mp = new MercadoPago("TEST-fcac8a22-0e63-490d-9ac5-7692b874331c", { locale: "es-AR" });
    try {
      const orderData = {
        title: "Producto Prueba",
        quantity: 1,
        price: 100,
      };

      const response = await fetch("/api/client/payments/generate_payment", {
        method: "POST",
        body: JSON.stringify(orderData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const preference = await response.json();
      createCheckoutButton(preference.id);
    } catch (err) {
      console.log("Error procesando el pago: " + err);
    }

    function createCheckoutButton(preferenceId) {
      const bricksBiulder = mp.bricks();

      const renderComponent = async () => {
        if (window.checkoutButton) window.checkoutButton.unmount();

        await bricksBiulder.create("wallet", "wallet_container", {
          initialization: {
            preferenceId: preferenceId,
          },
        });

        $("#mercado-pago-spinner").hide();
      };

      renderComponent();
    }
  }
});

if (localStorage.getItem("userId")) {
  fetch(`/api/client/carts/${localStorage.getItem("userId")}`)
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        $("#checkout_parcial_total").text(data.total).formatCurrency();
        $("#checkout_total").text(data.total).formatCurrency();

        if (data.total <= 0) {
          $("#checkout_button_whatsapp").prop("disabled", true);
          $("#checkout_button_whatsapp").addClass("cursor-not-allowed");
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      return "";
    });
} else {
  const localCart = JSON.parse(localStorage.getItem("cart"));

  $("#checkout_parcial_total").text(localCart.total).formatCurrency();
  $("#checkout_total").text(localCart.total).formatCurrency();

  if (localCart.total <= 0) {
    $("#checkout_button_whatsapp").prop("disabled", true);
    $("#checkout_button_whatsapp").addClass("cursor-not-allowed");
  }
}

function generarMensajeWhatsApp(datosFormulario, productos, totalCompra) {
  let detallesProductos = "";

  // Crear un array de promesas
  const productPromises = productos.map((producto) => {
    return fetch(`/api/client/products/${producto.id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          detallesProductos += `\n- Producto: ${data.product.title}\n- Cantidad: ${producto.quantity}\n`;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  // Esperar a que todas las promesas se resuelvan
  return Promise.all(productPromises).then(() => {
    const mensaje = `Hola, me gustaría coordinar la compra con los siguientes detalles:\n\n- Nombre completo: ${datosFormulario.nombre}\n- Email: ${datosFormulario.email}\n- País: ${datosFormulario.pais}\n- Provincia: ${datosFormulario.provincia}\n- Localidad: ${datosFormulario.localidad}\n- Código Postal: ${datosFormulario.codigoPostal}\n- Número de teléfono: ${datosFormulario.telefono}\n\nDetalles de los productos:${detallesProductos}`;
    return mensaje;
  });
}

function redirigirAWhatsApp(mensaje) {
  fetch(`/api/client/enterprise/enterprise-info`)
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        const numeroWhatsApp = data[0].phone.replace(/[\s-]/g, "");

        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, "_blank");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      return "";
    });
}

$("#checkout_button_whatsapp").on("click", function (e) {
  e.preventDefault();

  const datosFormulario = {
    nombre: $("#your_name").val(),
    email: $("#your_email").val(),
    pais: $("#select-country-input-3").val(),
    provincia: $("#select-province-input-3 option:selected").text(),
    localidad: $("#select-city-input-3").val(),
    codigoPostal: $("#your_postal_code").val(),
    telefono: $("#phone-input").val(),
  };

  const isEmpty = (value) => {
    return value === "" || value === null || value === undefined || value === "Seleccione una provincia" || value === "Seleccione una localidad";
  };

  let hasEmptyFields = false;

  const inputs = {
    nombre: "#your_name",
    email: "#your_email",
    pais: "#select-country-input-3",
    provincia: "#select-province-input-3",
    localidad: "#select-city-input-3",
    codigoPostal: "#your_postal_code",
    telefono: "#phone-input",
  };

  for (const key in datosFormulario) {
    if (datosFormulario.hasOwnProperty(key)) {
      const inputSelector = inputs[key];
      const $input = $(inputSelector);

      $input.removeClass("input-tiene-error");

      if (isEmpty(datosFormulario[key])) {
        hasEmptyFields = true;
        $input.addClass("input-tiene-error");
      }
    }
  }

  if (hasEmptyFields) {
    toast({ status: "error", message: "Completa el formulario para copiar el mensaje." });
  } else {
    if (localStorage.getItem("userId")) {
      fetch(`/api/client/carts/${localStorage.getItem("userId")}`)
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            const productos = data.products;
            const totalCompra = data.total;
            generarMensajeWhatsApp(datosFormulario, productos, totalCompra).then((mensaje) => {
              redirigirAWhatsApp(mensaje);
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          return "";
        });
    } else {
      const localCart = JSON.parse(localStorage.getItem("cart"));
      const productos = localCart.products;
      const totalCompra = localCart.total;
      generarMensajeWhatsApp(datosFormulario, productos, totalCompra).then((mensaje) => {
        redirigirAWhatsApp(mensaje);
      });
    }
  }
});

$("#copy_wpp_message").on("click", function (e) {
  const datosFormulario = {
    nombre: $("#your_name").val(),
    email: $("#your_email").val(),
    pais: $("#select-country-input-3").val(),
    provincia: $("#select-province-input-3 option:selected").text(),
    localidad: $("#select-city-input-3").val(),
    codigoPostal: $("#your_postal_code").val(),
    telefono: $("#phone-input").val(),
  };

  const isEmpty = (value) => {
    return value === "" || value === null || value === undefined || value === "Seleccione una provincia" || value === "Seleccione una localidad";
  };

  let hasEmptyFields = false;

  const inputs = {
    nombre: "#your_name",
    email: "#your_email",
    pais: "#select-country-input-3",
    provincia: "#select-province-input-3",
    localidad: "#select-city-input-3",
    codigoPostal: "#your_postal_code",
    telefono: "#phone-input",
  };

  for (const key in datosFormulario) {
    if (datosFormulario.hasOwnProperty(key)) {
      const inputSelector = inputs[key];
      const $input = $(inputSelector);

      $input.removeClass("input-tiene-error");

      if (isEmpty(datosFormulario[key])) {
        hasEmptyFields = true;
        $input.addClass("input-tiene-error");
      }
    }
  }

  if (hasEmptyFields) {
    toast({ status: "error", message: "Completa el formulario para copiar el mensaje." });
  } else {
    if (localStorage.getItem("userId")) {
      fetch(`/api/client/carts/${localStorage.getItem("userId")}`)
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            const productos = data.products;
            const totalCompra = data.total;
            generarMensajeWhatsApp(datosFormulario, productos, totalCompra).then((mensaje) => {
              navigator.clipboard.writeText(mensaje).then(
                function () {
                  toast({ status: "success", message: "Mensaje copiado al portapapeles con éxito!" });
                },
                function (err) {
                  console.error("Error al copiar el mensaje al portapapeles: ", err);
                  toast({ status: "error", message: `Error al copiar el mensaje al portapapeles: ${err}` });
                }
              );
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          return "";
        });
    } else {
      const localCart = JSON.parse(localStorage.getItem("cart"));
      const productos = localCart.products;
      const totalCompra = localCart.total;
      generarMensajeWhatsApp(datosFormulario, productos, totalCompra).then((mensaje) => {
        navigator.clipboard.writeText(mensaje).then(
          function () {
            toast({ status: "success", message: "Mensaje copiado al portapapeles con éxito!" });
          },
          function (err) {
            toast({ status: "error", message: `Error al copiar el mensaje al portapapeles: ${err}` });
          }
        );
      });
    }
  }
});
