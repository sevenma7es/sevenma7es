// export function productsCategories(categories) {
//   const parentCategories = [];
//   const subCategories = [];
//   let html = "<ul>";

//   categories.forEach((category) => {
//     if (!category.parent || category.parent === "") {
//       parentCategories.push(category);
//     } else {
//       subCategories.push(category);
//     }
//   });

//   parentCategories.forEach((parentCategory) => {
//     let filteredSubCategories = [];

//     subCategories.forEach((subCategory) => {
//       if (subCategory.parent.toString() === parentCategory._id.toString()) {
//         filteredSubCategories.push(subCategory);
//       }
//     });

//     function categoryItem(category) {
//       return `<li><a class="hover:underline" href="/productos/categoria/${category.slug}">${category.name}</a></li>`;
//     }

//     html += `
//         <a class="font-bold hover:underline" href="/productos/categoria/${
//           parentCategory.slug
//         }">${parentCategory.name}</a>
//         <ul class="mb-4 text-[var(--main-light-10)] dark:text-gray-400">
//           ${filteredSubCategories.map(categoryItem).join("")}
//         </ul>
//     `;
//   });

//   html += "</ul>";

//   return html;
// }

export function productsCategories(categories) {
  const parentCategories = [];
  const subCategories = [];
  let html = "";

  categories.forEach((category) => {
    if (!category.parent || category.parent === "") {
      parentCategories.push(category);
    } else {
      subCategories.push(category);
    }
  });

  parentCategories.forEach((parentCategory) => {
    let filteredSubCategories = [];

    subCategories.forEach((subCategory) => {
      if (subCategory.parent.toString() === parentCategory._id.toString()) {
        filteredSubCategories.push(subCategory);
      }
    });

    function categoryItem(category) {
      return `
        <a href="/productos/categoria/${category.slug}">
          <li class="relative select-none py-2 pl-3 pr-9 text-[var(--main-text-light)] hover:!bg-[#f9fafb] cursor-pointer" role="option" category-slug="${category.slug}">
            <div class="flex items-center">
              <span class="ml-3 block truncate font-normal">${category.name}</span>
            </div>
          </li>
        </a>
      `;
    }

    html += `
      <a href="/productos/categoria/${parentCategory.slug}">
        <li class="relative select-none py-2 pl-3 pr-9 text-[var(--main-text-light)] hover:!bg-[#f9fafb] cursor-pointer" role="option" category-slug="${parentCategory.slug}">
          <div class="flex items-center">
            <span class="ml-3 block truncate font-bold">${parentCategory.name}</span>
          </div>
        </li>
      </a>
      ${filteredSubCategories.map(categoryItem).join("")}
      <hr>
    `;
  });

  return html;
}
