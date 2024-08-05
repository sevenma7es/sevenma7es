import { formatCurrency } from "../../functions.js";

export function cartTotal(cart) {
  let q = 0;
  let envio = 0;
  let total = 0;
  let finalPrice = 0;

  if (cart) {
    q = cart.products.length;
    total = cart.total;
    envio = q > 0 ? 5000 : 0;
    finalPrice = total + envio;
  }

  // return `
  //   <div class="mt-8">
  //     <div class="flex items-center justify-between pb-6">
  //       <p class="font-normal text-lg leading-8 text-[var(--main-text-light)] dark:text-[var(--main-text-dark)]">Items (${q})</p>
  //       <p class="font-medium text-lg leading-8 text-[var(--main-text-light)] dark:text-[var(--main-text-dark)]">${formatCurrency(total)}</p>
  //     </div>
  //     <div class="flex items-center justify-between pb-6">
  //       <p class="font-normal text-lg leading-8 text-[var(--main-text-light)] dark:text-[var(--main-text-dark)]">Envío</p>
  //       <p class="font-medium text-lg leading-8 text-[var(--main-text-light)] dark:text-[var(--main-text-dark)]">${formatCurrency(envio)}</p>
  //     </div>
  //     <div class="flex items-center justify-between pb-6 border-b border-gray-200">
  //       <p class="font-medium text-xl leading-8 text-[var(--main-text-light)] dark:text-[var(--main-text-dark)]">Total</p>
  //       <p class="font-semibold text-xl leading-8 text-[var(--main-dark-1)]">${formatCurrency(finalPrice)}</p>
  //     </div>
  //   </div>
  //   <a href="/checkout">
  //       <button class="w-full text-center bg-[var(--main-dark-1)] rounded-xl py-3 px-6 font-semibold text-lg text-white transition-all duration-500 hover:bg-[var(--main-dark-5)] mt-6">Checkout</button>
  //   </a>
  // `;
  return `
    <div class="mt-8">
      <div class="flex items-center justify-between pb-6">
        <p class="font-normal text-lg leading-8 text-[var(--main-text-light)] dark:text-[var(--main-text-dark)]">Items (${q})</p>
        <p class="font-medium text-lg leading-8 text-[var(--main-text-light)] dark:text-[var(--main-text-dark)]">${formatCurrency(total)}</p>
      </div>
      <div class="flex items-center justify-between pb-6 border-b border-gray-200">
        <p class="font-medium text-xl leading-8 text-[var(--main-text-light)] dark:text-[var(--main-text-dark)]">Total</p>
        <p class="font-semibold text-xl leading-8 text-[var(--main-text-light)] dark:text-[var(--main-text-dark)]">${formatCurrency(total)}</p>
      </div>
    </div>
    <a href="/checkout">
        <button class="w-full text-center bg-[var(--main-dark-1)] rounded-xl py-3 px-6 font-semibold text-lg text-white transition-all duration-500 hover:bg-[var(--main-dark-5)] mt-6">Checkout</button>
    </a>
  `;
}
