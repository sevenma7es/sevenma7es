$("#usersSearchDropdown").dropdown({
  title: "Nombre",
  items: [
    {
      title: "Nombre",
      id: "full_name",
    },
    {
      title: "Email",
      id: "email",
    },
  ],
  defaultSearch: "full_name",
});

function searchUser() {
  const findBy = $("#usersSearchDropdown").attr("findBy");
  const query = $("#searchInput").val();

  fetch(`/api/admin/users/search?findBy=${findBy}&query=${query}`)
    .then((response) => response.json())
    .then((data) => {
      const tbody = document.getElementById("users_tbody");
      tbody.innerHTML = "";
      if (data.users.length > 0) {
        data.users.forEach((user) => {
          const row = document.createElement("tr");
          row.className = "even:bg-[var(--main-light-1)] even:dark:bg-[var(--main-dark-7)] odd:bg-[var(--main-light-2)] odd:dark:bg-[var(--main-dark-3)] border-b dark:border-[var(--main-dark-10)] cursor-pointer";
          row.id = user.slug;
          row.innerHTML = `
                  <td scope="row" class="px-2 py-2 font-medium text-[var(--main-text-light)] whitespace-nowrap dark:text-white">${user.full_name}</td>
                  <td class="px-2 py-2">${user.email || ""}</td>
                `;
          $("#searchButton").prop("disabled", false);

          const td = document.createElement("td");
          td.className = "px-2 py-2 font-medium text-[var(--main-text-light)] whitespace-nowrap dark:text-white";
          td.scope = "row";

          user.roles.sort().forEach((role) => {
            let colors = "";

            switch (role) {
              case "admin":
                colors = "bg-red-300 text-red-800";
                break;
              case "empleado":
                colors = "bg-emerald-300 text-emerald-800";
                break;
              case "user":
                colors = "bg-indigo-200 text-indigo-800";
                break;
            }
            td.innerHTML += `<span class="${colors} text-xs font-semibold me-2 px-2.5 py-0.5 rounded-full">${role.toUpperCase()}</span>`;
          });
          row.append(td);
          tbody.appendChild(row);
        });
      } else {
        const row = document.createElement("tr");
        row.className = "even:bg-[var(--main-light-1)] even:dark:bg-[var(--main-dark-7)] odd:bg-[var(--main-light-2)] odd:dark:bg-[var(--main-dark-3)] border-b dark:border-[var(--main-dark-10)] cursor-pointer";
        row.innerHTML = `
                  <td colspan="3" scope="row" class="px-2 py-2 font-medium text-[var(--main-text-light)] whitespace-nowrap dark:text-white">No data.</td>
                `;
        $("#searchButton").prop("disabled", false);
        tbody.appendChild(row);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      $("#searchButton").prop("disabled", false);
    });
}
$("#searchButton").on("click", function (e) {
  e.preventDefault();
  $(this).prop("disabled", true);
  searchUser();
});

$("table").contextMenuPlugin({
  menuSelector: "#contextMenu",
});
