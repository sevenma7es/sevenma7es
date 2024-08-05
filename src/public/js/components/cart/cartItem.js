import { formatCurrency } from "../../functions.js";

export async function cartItem(product) {
  return fetch(`/api/client/enterprise/enterprise-info`)
    .then((response) => response.json())
    .then((data) => {
      let enterprise = data ? data[0] : { name: "" };

      return `
        <div id="product-card-${product._id}" class="flex flex-col min-[500px]:flex-row min-[500px]:items-center gap-5 py-6 border-b border-[var(--main-dark-1)] dark:border-[var(--main-light-1)] group relative">
          <div class="w-full md:max-w-[126px] bg-[var(--main-bg-light)] rounded-sm overflow-hidden">
            <img src="${product.images[0]}" alt="${product.title}" class="mx-auto">
          </div>
          <div class="grid grid-cols-1 md:grid-cols-4 w-full">
            <div class="md:col-span-2">
              <div class="flex flex-col max-[500px]:items-center gap-3">
                <h6 class="font-semibold text-base leading-7 text-[var(--main-text-light)] dark:text-[var(--main-text-dark)]">${product.title}</h6>
                <h6 class="font-normal text-base leading-7 text-[var(--main-dark-5)] dark:text-[var(--main-light-5)]">${product.brand || enterprise.name}</h6>
                <h6 class="font-medium text-base leading-7 text-[var(--main-dark-5)] dark:text-[var(--main-light-5)] transition-all duration-300 group-hover:text-[var(--main-dark-1)] group-hover:dark:text-[var(--main-light-1)]" data-price-unformatted-${product._id}="${product.price}">
                  ${formatCurrency(product.price)}
                </h6>
              </div>
            </div>
            <div class="flex items-center max-[500px]:justify-center h-full max-md:mt-3">
              <div class="flex items-center h-full">
                <button class="group rounded-l-xl px-5 py-[18px] border border-[var(--main-dark-1)] dark:border-[var(--main-light-1)] flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-[var(--main-light-accent)] hover:dark:bg-[var(--main-dark-accent)]  focus-within:outline-gray-300 removeOne" data-button="${product._id}" aria-label="Eliminar Producto del Carrito">
                  <svg class="stroke-[var(--main-dark-1)] dark:stroke-[var(--main-light-1)] transition-all duration-500 " xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M16.5 11H5.5" stroke="" stroke-width="1.6" stroke-linecap="round" />
                  </svg>
                </button>
                <input type="text" class="border-y border-[var(--main-dark-1)] dark:border-[var(--main-light-1)] outline-none text-[var(--main-dark-1)] dark:text-[var(--main-light-1)] font-semibold text-lg w-full max-w-[73px] min-w-[60px] placeholder:text-[var(--main-dark-1)] placeholder:dark:text-[var(--main-light-1)] py-[15px] text-center bg-transparent" id="quantity-${product._id}" value="${product.quantity}">
                <button class="group rounded-r-xl px-5 py-[18px] border border-[var(--main-dark-1)] dark:border-[var(--main-light-1)] flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-[var(--main-light-accent)] hover:dark:bg-[var(--main-dark-accent)] focus-within:outline-gray-300 addOne" data-button="${product._id}" aria-label="Quitar una Unidad">
                  <svg class="stroke-[var(--main-dark-1)] dark:stroke-[var(--main-light-1)] transition-all duration-500 " xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M11 5.5V16.5M16.5 11H5.5" stroke="" stroke-width="1.6" stroke-linecap="round" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="flex items-center max-[500px]:justify-center md:justify-end max-md:mt-3 h-full">
              <p id="parcialTotal-${product._id}" class="font-bold text-lg leading-8 text-[var(--main-dark-5)] dark:text-[var(--main-light-5)] text-center transition-all duration-300 group-hover:text-[var(--main-dark-1)] group-hover:dark:text-[var(--main-light-1)]">
                ${formatCurrency(product.price * product.quantity)}
              </p>
            </div>
          </div>
         <button class="deleteButton absolute top-2 right-2" data-button="${product._id}" aria-label="Agregar una Unidad">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
         </button>
        </div>
      `;
    })
    .catch((error) => {
      console.error("Error:", error);
      return "";
    });
}
