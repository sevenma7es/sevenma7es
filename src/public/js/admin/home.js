$("#invoices-stats-container").hidePanel({
  title: "Estadisticas de facturas",
  button_id: "button_invoices",
});

$("#invoices2-stats-container").hidePanel({
  title: "Estadisticas de facturas",
  button_id: "button_invoices2",
});

$("#users-stats-container").hidePanel({
  title: "Estadisticas de usuarios",
  button_id: "button_users",
});

$(document).ready(function () {
  const invoicesFetchData = async (url) => {
    try {
      const response = await fetch(url);
      return response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const mapMonthNumberToName = (monthNumber) => monthNames[monthNumber - 1];
  const renderChart = (ctx, type, labels, data, label) => {
    new Chart(ctx, {
      type: type,
      data: {
        labels: labels,
        datasets: [
          {
            label: label,
            data: data,
            backgroundColor: ["rgba(255, 0, 0, 0.2)", "rgba(255, 127, 0, 0.2)", "rgba(255, 255, 0, 0.2)", "rgba(127, 255, 0, 0.2)", "rgba(0, 255, 0, 0.2)", "rgba(0, 255, 127, 0.2)", "rgba(0, 255, 255, 0.2)", "rgba(0, 127, 255, 0.2)", "rgba(0, 0, 255, 0.2)", "rgba(127, 0, 255, 0.2)", "rgba(255, 0, 255, 0.2)", "rgba(255, 0, 127, 0.2)"],
            borderColor: ["rgba(255, 0, 0, 0.2)", "rgba(255, 127, 0, 0.2)", "rgba(255, 255, 0, 0.2)", "rgba(127, 255, 0, 0.2)", "rgba(0, 255, 0, 0.2)", "rgba(0, 255, 127, 0.2)", "rgba(0, 255, 255, 0.2)", "rgba(0, 127, 255, 0.2)", "rgba(0, 0, 255, 0.2)", "rgba(127, 0, 255, 0.2)", "rgba(255, 0, 255, 0.2)", "rgba(255, 0, 127, 0.2)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  const loadInvoicesStats = async () => {
    const response = await invoicesFetchData("/api/admin/invoices/total_invoices_by_month");
    const invoicesStats = response.total_invoices_by_month.data;
    const labels = invoicesStats.map((data) => mapMonthNumberToName(data._id));
    const data = invoicesStats.map((data) => data.count);
    const ctx = document.getElementById("invoicesStatsChart").getContext("2d");
    renderChart(ctx, "bar", labels, data, "Total Facturas por Mes");
  };

  const loadAmountStats = async () => {
    const response = await invoicesFetchData("/api/admin/invoices/total_amount_by_month");
    const amountStats = response.total_amount_by_month.data;
    const labels = amountStats.map((data) => mapMonthNumberToName(data._id));
    const data = amountStats.map((data) => data.totalAmount);
    const ctx = document.getElementById("amountStatsChart").getContext("2d");
    renderChart(ctx, "bar", labels, data, "Total Monto por Mes");
  };

  const loadTypeStats = async () => {
    const response = await invoicesFetchData("/api/admin/invoices/invoices_by_type");
    const typeStats = response.invoices_by_type.data;
    const labels = typeStats.map((data) => `Tipo ${data._id}`);
    const data = typeStats.map((data) => data.count);
    const ctx = document.getElementById("typeStatsChart").getContext("2d");
    renderChart(ctx, "pie", labels, data, "Total Facturas por Tipo");
  };

  loadInvoicesStats();
  loadAmountStats();
  loadTypeStats();

  $.ajax({
    url: "/api/admin/users/users_stats",
    method: "GET",
    success: function (response) {
      if (response.status === "success") {
        const ctx = $("#userStatsChart")[0].getContext("2d");
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Usuarios Totales", "Usuarios Admin", "Usuarios Clientes"],
            datasets: [
              {
                label: "Usuarios",
                data: [response.data.totalUsers, response.data.adminUsers, response.data.customerUsers],
                backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)"],
                borderColor: ["rgba(75, 192, 192, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)"],
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      } else {
        console.error("Error fetching user stats:", response.message);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
    },
  });

  $.ajax({
    url: "/api/admin/products/products_stats",
    method: "GET",
    success: function (response) {
      if (response.status === "success") {
        const ctx = $("#productStatsChart")[0].getContext("2d");
        const categories = response.data.productsByCategory.map((cat) => cat._id);
        const counts = response.data.productsByCategory.map((cat) => cat.count);

        new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Total de Productos"].concat(categories),
            datasets: [
              {
                label: "Productos",
                data: [
                  response.data.totalProducts,
                  // response.data.lowStockProducts,
                ].concat(counts),
                backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"].concat(Array(categories.length).fill("rgba(153, 102, 255, 0.2)")),
                borderColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"].concat(Array(categories.length).fill("rgba(153, 102, 255, 0.2)")),
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });

        $("#tbody-low-stock-products").find("td").remove();
        const lowStockProducts = response.data.lowStockProducts;
        $(lowStockProducts).each(function () {
          $("#tbody-low-stock-products").append(`
            <tr class="even:bg-[var(--main-light-0.2)] even:dark:bg-[var(--main-dark-7)] odd:bg-[var(--main-light-2)] odd:dark:bg-[var(--main-dark-3)] border-b dark:border-[var(--main-dark-10)]">
              <td class="px-6 py-1 font-medium text-[var(--main-text-light)] whitespace-nowrap dark:text-white">
                ${this.title}
              </td>
              <td class="px-6 py-1 font-medium text-[var(--main-text-light)] whitespace-nowrap dark:text-white">
                ${this.stock}
              </td>
            </tr>
          `);
        });
      } else {
        console.error("Error fetching product stats:", response.message);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
    },
  });
});
