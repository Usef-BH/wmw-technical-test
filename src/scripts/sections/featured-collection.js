/**
 * Section: Featured collection
 * ------------------------------------------------------------------------------
 * Featured collection configuration for complete theme support
 * - https://github.com/Shopify/theme-scripts/tree/master/packages/theme-sections
 *
 * @namespace featuredCollection
 */
import {register} from '@shopify/theme-sections';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';

/**
 * Featured collection constructor
 * Executes on page load as well as Theme Editor `section:load` events.
 *
 * @param {string} container - selector for the section container DOM element
 */
register('featured-collection', {
  init() {
    this.publicMethod();
  },

  publicMethod() {
    window.console.log('Initialising featured collection section');
  },
});

new Swiper('.swiper-container', {
  slidesPerView: 4,
  slidesPerGroup: 4,
  spaceBetween: 22,
  breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: 22,
    },
    // when window width is >= 480px
    640: {
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: 22,
    },
    // when window width is >= 640px
    960: {
      slidesPerView: 3,
      slidesPerGroup: 3,
      spaceBetween: 22,
    },
    1280: {
      slidesPerView: 4,
      slidesPerGroup: 4,
      spaceBetween: 22,
    },
  },
  pagination: {
    el: '.swiper-pagination',
  },
});

const buttons = document.querySelectorAll('#add-to-cart');

[...buttons].forEach((button) => {
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();

    const variantId = button.dataset.variantId;

    const cartText = button.querySelector('.add-to-cart-text');
    const cartLoader = button.querySelector('.add-to-cart-loader');

    cartText ? cartText.classList.add('hidden') : null;
    cartLoader ? cartLoader.classList.remove('hidden') : null;

    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            quantity: 1,
            id: variantId,
          },
        ],
      }),
    })
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        } else {
          throw Error('Adding to cart failed!');
        }
      })
      .then((resp) => {
        const cartItemCount = document.querySelector('#cart-item-count');

        if (cartItemCount) {
          const oldCartCount = Number(cartItemCount.innerText);
          cartItemCount.innerText = oldCartCount + 1;
        }

        cartText.innerText = 'Thank You!';
        cartLoader.classList.add('hidden');
        cartText.classList.remove('hidden');
        setTimeout(() => {
          cartText.innerText = 'Add to cart';
        }, 3500);
      })
      .catch((err) => {
        console.error('[ERROR]:', err);
        cartText.innerText = 'Operation Failed!';
        cartLoader.classList.add('hidden');
        cartText.classList.remove('hidden');
        setTimeout(() => {
          cartText.innerText = 'Add to cart';
        }, 3500);
      });
  });
});
