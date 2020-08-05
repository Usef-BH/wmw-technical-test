/**
 * Section: Featured collection
 * ------------------------------------------------------------------------------
 * Featured collection configuration for complete theme support
 * - https://github.com/Shopify/theme-scripts/tree/master/packages/theme-sections
 *
 * @namespace featuredCollection
 */
import { register } from "@shopify/theme-sections";

/**
 * Featured collection constructor
 * Executes on page load as well as Theme Editor `section:load` events.
 *
 * @param {string} container - selector for the section container DOM element
 */
register("featured-collection", {
  init() {
    this.publicMethod();
  },

  publicMethod() {
    window.console.log("Initialising featured collection section");
  }
});

console.log("Section Registered!");

new Swiper(".swiper-container", {
  slidesPerView: 4,
  slidesPerGroup: 4,
  spaceBetween: 30,
  breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: 10
    },
    // when window width is >= 480px
    640: {
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: 20
    },
    // when window width is >= 640px
    960: {
      slidesPerView: 3,
      slidesPerGroup: 3,
      spaceBetween: 40
    },
    1280: {
      slidesPerView: 4,
      slidesPerGroup: 4,
      spaceBetween: 40
    }
  },
  pagination: {
    el: ".swiper-pagination"
  }
});

const buttons = document.querySelectorAll("#add-to-cart");

[...buttons].forEach((button) => {
  button.addEventListener('click', function(event) {
    event.stopPropagation();
    event.preventDefault();

    const variant_id = button.dataset.variantId;

    const cart_text = button.querySelector('.add-to-cart-text');
    const cart_loader = button.querySelector('.add-to-cart-loader');

    cart_text ? cart_text.classList.add('hidden') : null;
    cart_loader ? cart_loader.classList.remove('hidden'): null;

    fetch("/cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: [
          {
            quantity: 1,
            id: variant_id
          }
        ]
      })
    })
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        } else {
          throw Error("Adding to cart failed!");
        }
      })
      .then(resp => {
        let cart_item_count = document.querySelector("#cart-item-count");

        if (cart_item_count) {
          let old_cart_count = +cart_item_count.innerText;
          cart_item_count.innerText = old_cart_count + 1;
        }

        cart_text.innerText = "Thank You!";
        cart_loader.classList.add("hidden");
        cart_text.classList.remove("hidden");
        setTimeout(function() {
          cart_text.innerText = "Add to cart";
        }, 3500);
      })
      .catch(err => {
        console.error("[ERROR]:", err);
        cart_text.innerText = "Operation Failed!";
        cart_loader.classList.add("hidden");
        cart_text.classList.remove("hidden");
        setTimeout(function() {
          cart_text.innerText = "Add to cart";
        }, 3500);
      });
  });
});
