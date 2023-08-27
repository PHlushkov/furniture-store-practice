"use strict";
//How to identify a mobile user on a website

const isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function () {
    return (
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Opera() ||
      isMobile.Windows()
    );
  },
};

window.onload = function () {
  document.addEventListener("click", documentActions);

  function documentActions(e) {
    const targetElement = e.target;

    if (window.innerWidth > 768 && isMobile.any()) {
      if (targetElement.classList.contains("menu__arrow")) {
        targetElement.closest(".menu__item").classList.toggle("_hover");
      }
    }
    if (targetElement.classList.contains("search-form__icon_search")) {
      document.querySelector(".search-form").classList.toggle("_active");
    } else if (
      !targetElement.closest(".search-form") &&
      document.querySelector(".search-form._active")
    ) {
      document.querySelector(".search-form").classList.remove("_active");
    }
    if (targetElement.classList.contains("products__more")) {
      getProducts(targetElement);
      e.preventDefault();
    }

    if (targetElement.classList.contains("actions-product__button")) {
      const productId = targetElement.closest(".item-product").dataset.pid;
      addToCart(targetElement, productId);
      e.preventDefault();
    }

    if (
      targetElement.classList.contains("cart-header__icon") ||
      targetElement.closest(".cart-header__icon")
    ) {
      if (document.querySelector(".cart-list").children.length > 0) {
        document.querySelector(".cart-header").classList.toggle("_active");
      }
      e.preventDefault();
    } else if (
      !targetElement.closest(".cart-header") &&
      !targetElement.classList.contains("actions-product__button")
    ) {
      document.querySelector(".cart-header").classList.remove("_active");
    }

    if (targetElement.classList.contains("cart-list__delete")) {
      const productId =
        targetElement.closest(".cart-list__item").dataset.cartPid;
      updateCart(targetElement, productId, false);
      e.preventDefault();
    }
  }

  //header

  const headerElement = document.querySelector(".header");

  const callback = function (entries, observer) {
    if (entries[0].isIntersecting) {
      headerElement.classList.remove("_scroll");
    } else {
      headerElement.classList.add("_scroll");
    }
  };

  const headerObserver = new IntersectionObserver(callback);
  headerObserver.observe(headerElement);
};

// remove placeholder in input when focusing

const inputSubscr = document.querySelector(".subscribe__input");
const inputElem = document.querySelector("input");

inputElem.addEventListener("focus", function () {
  this.removeAttribute("placeholder");
});

inputElem.addEventListener("blur", function () {
  this.setAttribute("placeholder", "Search for minimalist chair");
});
// //////////////////////////////////////
inputSubscr.addEventListener("focus", function () {
  this.removeAttribute("placeholder");
});

inputSubscr.addEventListener("blur", function () {
  this.setAttribute("placeholder", "Enter your email");
});

// Spoiler and accordion

document.addEventListener("DOMContentLoaded", function () {
  // Находим все кнопки с атрибутом data-spoiler
  const spoilerButtons = document.querySelectorAll("[data-spoiler]");

  spoilerButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      // Находим список подменю внутри родительского элемента (menu__item)
      const subMenu = button.nextElementSibling;

      // Проверяем, отображается ли подменю
      if (subMenu.classList.contains("active")) {
        // Если отображается, скрываем его
        subMenu.classList.remove("active");
      } else {
        // Если скрыто, скрываем все активные подменю и показываем текущее
        const activeSubMenus = document.querySelectorAll(
          ".menu__sub-list.active"
        );
        activeSubMenus.forEach(function (menu) {
          menu.classList.remove("active");
        });
        subMenu.classList.add("active");
      }
    });
  });
});

//

const footerMenu = document.querySelectorAll(".menu-footer__title");
const menuBody = document.querySelector(".menu__body");
const button = document.querySelector(".icon-menu");

button.addEventListener("click", function () {
  menuBody.classList.toggle("_active");
});

footerMenu.forEach((fotterElem) => {
  const arrowElem = fotterElem.previousElementSibling;
  fotterElem.addEventListener("click", function () {
    arrowElem.classList.toggle("active");
  });
});

// слайдер

$(document).ready(function () {
  $(".slider-main__container").slick({
    slidesToShow: 1, // Количество видимых слайдов
    prevArrow: $(".slider-arrow_prev"),
    nextArrow: $(".slider-arrow_next"),
    dots: true, // Показывать точки навигации
  });
});

//addToCard

function addToCart(productButton, productId) {
  if (!productButton.classList.contains("_hold")) {
    productButton.classList.add("_hold");
    productButton.classList.add("_fly");

    const cart = document.querySelector(".cart-header__icon");
    const product = document.querySelector(`[data-pid="${productId}"]`);
    const productImage = product.querySelector(".item-product__img");

    const productImageFly = productImage.cloneNode(true);

    const productImageFlyWidth = productImage.offsetWidth;
    const productImageFlyHeight = productImage.offsetHeight;
    const productImageFlyTop = productImage.getBoundingClientRect().top;
    const productImageFlyLeft = productImage.getBoundingClientRect().left;

    productImageFly.setAttribute("class", "_flyImage _ibg");

    productImageFly.style.cssText = `
      left: ${productImageFlyLeft}px;
      top: ${productImageFlyTop}px;
      width: ${productImageFlyWidth}px;
      height: ${productImageFlyHeight}px;
    `;

    document.body.append(productImageFly);

    const cartFlyLeft = cart.getBoundingClientRect().left;
    const cartFlyTop = cart.getBoundingClientRect().top;

    productImageFly.style.cssText = `
    left: ${cartFlyLeft}px;
    top: ${cartFlyTop}px;
    width: 0px;
    height: 0px;
    opacity: 0;
    `;

    productImageFly.addEventListener("transitionend", function () {
      if (productButton.classList.contains("_fly")) {
        productImageFly.remove();
        updateCart(productButton, productId);
        productButton.classList.remove("_fly");
      }
    });
  }
}

function updateCart(productButton, productId, productAdd = true) {
  const cart = document.querySelector(".cart-header");
  const cartIcon = cart.querySelector(".cart-header__icon");
  const cartQuantity = cartIcon.querySelector("span");
  const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`);
  const cartList = document.querySelector(".cart-list");

  //add

  if (productAdd) {
    if (cartQuantity) {
      cartQuantity.innerHTML = ++cartQuantity.innerHTML;
    } else {
      cartIcon.insertAdjacentHTML("beforeend", `<span>1</span>`);
    }

    if (!cartProduct) {
      const product = document.querySelector(`[data-pid="${productId}"]`);

      const cartProductImage = product.getElementsByTagName("img");

      const cartProductTitle = product.querySelector(
        ".item-product__title"
      ).innerHTML;

      const cartProductContent = `
      <a href=""><img  class="cart-list__image" src="${cartProductImage[0].src}"></a>
      <div class="cart-list__body">
        <a href="" class="cart-list__title">${cartProductTitle}</a>
        <div class="cart-list__quantity">Quantity: <span>1</span></div>
        <a href="" class="cart-list__delete">Delete</a>
      </div>
      `;
      cartList.insertAdjacentHTML(
        "beforeend",
        `<li data-cart-pid="${productId}" class="cart-list__item"> ${cartProductContent} </li>`
      );
    } else {
      const cartProductQuantity = cartProduct.querySelector(
        ".cart-list__quantity span"
      );
      cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;
    }

    productButton.classList.remove("_hold");
  } else {
    const cartProductQuantity = cartProduct.querySelector(
      ".cart-list__quantity span"
    );
    cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;
    if (!parseInt(cartProductQuantity.innerHTML)) {
      cartProduct.remove();
    }
    const cartQuantityValue = --cartQuantity.innerHTML;

    if (cartQuantityValue) {
      cartQuantity.innerHTML = cartQuantityValue;
    } else {
      cartQuantity.remove();
      cart.classList.remove("_active");
    }
  }
}
