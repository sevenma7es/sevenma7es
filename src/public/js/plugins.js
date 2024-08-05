import { contextAction } from "./functions.js";

(function ($) {
  $.fn.contextMenuPlugin = function (options) {
    var settings = $.extend(
      {
        menuSelector: "#contextMenu",
        allowDoubleClick: false,
      },
      options
    );

    let $menu = $(settings.menuSelector);

    function hideMenu() {
      $menu.addClass("hidden").removeClass("block");
    }

    function showMenu() {
      $menu.addClass("block").removeClass("hidden");
    }

    function rightClick(e, boolean) {
      e.preventDefault();

      if ($menu.hasClass("block") && boolean) {
        hideMenu();
      } else {
        $menu.css("display", "block");
        const menuWidth = $menu.outerWidth();
        const menuHeight = $menu.outerHeight();
        $menu.css("display", "");

        let posX = e.pageX;
        let posY = e.pageY;

        if (posX + menuWidth > $(window).width()) {
          posX = $(window).width() - menuWidth;
        }
        if (posY + menuHeight > $(window).height()) {
          posY = $(window).height() - menuHeight;
        }

        $menu.css({
          left: posX + "px",
          top: posY + "px",
        });

        showMenu();
      }
    }

    return this.each(function () {
      var $table = $(this);
      var table_id = $table.attr("id");

      if (!table_id) {
        console.error("ERROR: Table not found... \nPlease verify that the table exists and that the table has a valid id.");
      } else {
        console.info("Contextmenu plugin loaded successfully");
        $table.on("click contextmenu", "tbody tr", function (e) {
          e.preventDefault();

          let isActive = $(this).hasClass("active");

          $table.find("tbody tr").removeClass("active");

          if (e.type === "click") {
            $(this).toggleClass("active", !isActive);
          } else if (e.type === "contextmenu") {
            $(this).addClass("active");
            rightClick(e, false);
          }
        });

        if (settings.allowDoubleClick) {
          $table.on("dblclick", "tbody tr", function (e) {
            e.preventDefault();
            let id = $(this).attr("id");
            let screen = $menu.attr("screen");
            if (!screen) {
              console.error("Screen not found");
              return;
            }
            let action = "edit"; // Assuming "edit" action is the default for double-click
            let url = contextAction(screen, action, id);

            if (!url) {
              console.error("URL not found. \nCheck the contextAction function.");
            } else {
              window.location.replace(url);
            }
          });
        }

        $("#context-menu-ul")
          .find("li")
          .on("click", function (e) {
            try {
              let id = $($table).find("tr.active").attr("id");
              let screen = $("#contextMenu").attr("screen");
              if (!screen) {
                throw new Error("Screen not found");
              }
              let action = $(this).attr("action");
              if (!action) {
                throw new Error("Action not found");
              }

              let url = contextAction(screen, action, id);

              if (!url) {
                throw new Error("URL not found. \nCheck the contextAction function.");
              } else {
                if (action === "delete") {
                  fetch(`/api${url}`, {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  })
                    .then((res) => {
                      switch (res.status) {
                        case 500:
                          alert("Error: " + res.status);
                          break;
                        case 200:
                          window.location.reload();
                          break;
                      }
                    })
                    .catch((error) => console.error("Error:", error));
                } else {
                  window.location.replace(url);
                }
              }
            } catch (err) {
              console.error(err);
            }
          });

        $(document).on("click", hideMenu);
      }
    });
  };
})(jQuery);

(function ($) {
  $.fn.validateForm = function () {
    var required_flag = false;

    this.each(function () {
      var $form = $(this);

      $form.find("input[required]").each(function () {
        if (($(this).attr("type") === "text" && $(this).val() === "") || ($(this).attr("type") === "number" && ($(this).val() === "0" || $(this).val() === ""))) {
          if ($(this).attr("id") === "price") {
            $(this).closest("div").addClass("input-tiene-error");
            required_flag = true;
          } else {
            $(this).addClass("input-tiene-error");
            required_flag = true;
          }
        } else {
          $(this).removeClass("input-tiene-error");

          if ($(this).attr("id") === "price") {
            $(this).closest("div").removeClass("input-tiene-error");
          } else {
            $(this).removeClass("input-tiene-error");
          }
        }
      });
    });

    return required_flag;
  };
})(jQuery);

(function ($) {
  $.fn.noSpace = function (options) {
    var settings = $.extend(
      {
        replaceWith: "-",
      },
      options
    );

    return this.each(function () {
      $(this).on("input", function () {
        $(this).val(function (index, value) {
          return value.replace(/\s+/g, settings.replaceWith);
        });
      });
    });
  };
})(jQuery);

(function ($) {
  $.fn.dropdown = function (options) {
    var settings = $.extend(
      {
        title: "Selecciona una opción",
        items: [],
        defaultSearch: "title",
      },
      options
    );

    function generalConfig(dropdown, defaultSearch) {
      dropdown.addClass("text-white bg-[var(--main-bg-dark)] dark:bg-[var(--main-bg-light)] text-[var(--main-text-dark)] dark:text-[var(--main-text-light)] focus:ring-4 focus:outline-none focus:ring-[var(--main-dark-10)] font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center   dark:focus:ring-[var(--main-light-10)] mr-2 !min-w-40 justify-between");
      dropdown.attr("type", "button").attr("findBy", defaultSearch);
      dropdown.append(`<svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
      fill="none" viewBox="0 0 10 6">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
    </svg>`);
    }

    function dropdownItems(dropdown, items) {
      dropdown.append(`<div id="dropdown"
    class="absolute inset-y-0 left-0 m-0 transform translate-x-[327px] translate-y-[70px] z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 h-fit dark:bg-[var(--main-bg-dark)]">
    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
      ${items
        .map(function (item) {
          return `<li>
        <span class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-[var(--main-dark-5)] dark:hover:text-white" id="${item.id}">${item.title}</span>
      </li>`;
        })
        .join("")}
    </div>`);
    }

    return this.each(function () {
      var $dropdownButton = $(this);

      const spanTitle = `<span id="searchButtonTitle">${settings.title}</span>`;
      $dropdownButton.text("").append(spanTitle);
      generalConfig($dropdownButton, settings.defaultSearch);
      dropdownItems($dropdownButton, settings.items);

      $dropdownButton.on("click", function (event) {
        event.stopPropagation();
        $("#dropdown").toggleClass("hidden block");
      });

      $(document).on("click", function (event) {
        if (!$(event.target).closest($dropdownButton).length) {
          $("#dropdown").removeClass("block").addClass("hidden");
        }
      });

      $("#dropdown")
        .find("span")
        .on("click", function (event) {
          $dropdownButton.attr("findBy", $(this).attr("id"));
          $dropdownButton.find("span#searchButtonTitle").text($(this).text());
        });
    });
  };
})(jQuery);

(function ($) {
  $.fn.hidePanel = function (options) {
    var settings = $.extend(
      {
        title: "Titulo del panel",
        button_id: "",
      },
      options
    );

    return this.each(function () {
      var $panel_container = $(this);
      $panel_container.addClass("border border-[var(--main-text-light)] dark:border-[var(--main-text-dark)] rounded-md overflow-hidden mb-2");
      var $panel_title_container = document.createElement("div");
      $panel_title_container.className = "flex justify-between p-2 text-[var(--main-text-dark)] dark:text-[var(--main-text-light)] bg-[var(--main-bg-dark)] dark:bg-[var(--main-bg-light)]";
      $panel_title_container.innerHTML = settings.title;
      $panel_title_container.innerHTML += `<svg class="cursor-pointer" id="${settings.button_id}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-plus"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>`;
      $panel_container.prepend($panel_title_container);
      if (settings.button_id != "" && settings.button_id != null) {
        $(`#${settings.button_id}`).on("click", function () {
          $($panel_title_container).next().toggleClass("hidden");
        });
      }
    });
  };
})(jQuery);

(function ($) {
  $.fn.simpleCarousel = function (options) {
    var settings = $.extend(
      {
        items: [],
        classes: "",
      },
      options
    );

    return this.each(function () {
      var $this = $(this);
      $this.addClass(settings.classes);

      // Create carousel structure
      var carouselWrapper = $('<div class="relative h-full overflow-hidden"></div>');
      var indicators = $('<div class="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse"></div>');
      var prevButton = $('<button type="button" class="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev></button>');
      var nextButton = $('<button type="button" class="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next></button>');

      // Create carousel items
      settings.items.forEach(function (item, index) {
        var carouselItem = $('<div class="duration-700 ease-in-out"></div>').attr("data-carousel-item", index === 0 ? "active" : "");
        var img = $("<img>").attr("src", item).addClass("absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2").attr("alt", "...");
        carouselItem.append(img);
        carouselWrapper.append(carouselItem);

        // Create indicator buttons
        var indicator = $('<button type="button" class="w-3 h-3 rounded-full"></button>')
          .attr("aria-current", index === 0 ? "true" : "false")
          .attr("aria-label", "Slide " + (index + 1))
          .attr("data-carousel-slide-to", index);
        indicators.append(indicator);
      });

      // Append controls
      prevButton.html('<span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none"><svg class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/></svg><span class="sr-only">Previous</span></span>');
      nextButton.html('<span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none"><svg class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/></svg><span class="sr-only">Next</span></span>');

      // Append elements to main container
      $this.append(carouselWrapper).append(indicators).append(prevButton).append(nextButton);

      // Carousel functionality
      var currentIndex = 0;
      var itemsCount = settings.items.length;

      function goToSlide(index) {
        carouselWrapper.children("div").removeClass("active").addClass("hidden");
        carouselWrapper.children("div").eq(index).removeClass("hidden").addClass("active");
        indicators.children("button").attr("aria-current", "false");
        indicators.children("button").eq(index).attr("aria-current", "true");
      }

      prevButton.on("click", function () {
        currentIndex = currentIndex > 0 ? currentIndex - 1 : itemsCount - 1;
        goToSlide(currentIndex);
      });

      nextButton.on("click", function () {
        currentIndex = currentIndex < itemsCount - 1 ? currentIndex + 1 : 0;
        goToSlide(currentIndex);
      });

      indicators.find("button").on("click", function () {
        var index = $(this).attr("data-carousel-slide-to");
        currentIndex = index;
        goToSlide(currentIndex);
      });

      // Initialize first slide
      goToSlide(currentIndex);
    });
  };
})(jQuery);

(function ($) {
  $.fn.formatCurrency = function (options) {
    var settings = $.extend(
      {
        locale: "es-AR",
        currency: "ARS",
      },
      options
    );

    return this.each(function () {
      var value = parseFloat($(this).text());
      if (isNaN(value)) return;

      var formattedValue = new Intl.NumberFormat(settings.locale, {
        style: "currency",
        currency: settings.currency,
      }).format(value);

      $(this).text(formattedValue);
    });
  };
})(jQuery);
