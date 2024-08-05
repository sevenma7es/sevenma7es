import exphbs from "express-handlebars";
import { getPath } from "../utils/functions.js";

const hbs = exphbs.create({
  helpers: {
    renderRoles: function (roles) {
      const roleBgColors = {
        admin: "bg-red-300",
        empleado: "bg-emerald-300",
        user: "bg-indigo-200",
      };

      const roleColors = {
        admin: "text-red-800",
        empleado: "text-emerald-800",
        user: "text-indigo-800",
      };

      return roles
        .map((role) => {
          const user_role = role.toUpperCase();
          const bgColorClass = roleBgColors[role] || "bg-gray-300";
          const colorClass = roleColors[role] || "text-[var(--main-text-light)]";
          return `<span class="${bgColorClass} ${colorClass} text-xs font-semibold me-2 px-2.5 py-0.5 rounded-full">${user_role}</span>`;
        })
        .join("");
    },
    eq: function (a, b) {
      return a === b;
    },
    formatDate: function (date) {
      const formattedDate = new Date(date).toLocaleDateString("es-ES");
      return formattedDate;
    },
    ifEquals: function (arg1, arg2, options) {
      return arg1 == arg2 ? options.fn(this) : options.inverse(this);
    },
    parseJSON: function (jsonString) {
      return JSON.parse(jsonString);
    },
    join: function (array, delimiter) {
      if (Array.isArray(array)) {
        return array.join(delimiter);
      } else {
        return;
      }
    },
    formatCurrency: function (value) {
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(value);
    },
    index: function (array, index) {
      return array[index];
    },
    truncate: function (str, len) {
      if (str.length > len) {
        return str.substring(0, len) + "...";
      }
      return str;
    },
    currency: function (price, locale) {
      let formattedPrice;

      switch (locale) {
        case "arg":
          formattedPrice = new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 2,
          }).format(price);
          break;

        default:
          formattedPrice = price;
          break;
      }

      return formattedPrice;
    },
    trim: function (str) {
      console.log(str);
      return str.trim();
    },
    isAdmin: function (roles, options) {
      if (roles.includes("admin")) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    isChecked: function (value) {
      return value ? "checked" : "";
    },
  },
  defaultLayout: "main",
  layoutsDir: getPath("views/layouts"),
  partialsDir: getPath("views/partials"),
});

export default hbs;
