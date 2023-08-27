async function getProducts(button) {
  if (!button.classList.contains("_hold")) {
    button.classList.add("_hold");
    const file = "../json/products.json";
    let response = await fetch(file, {
      method: "GET",
    });
    if (response.ok) {
      let result = await response.json();
      loadProducts(result);
      button.classList.remove("_hold");
      button.remove();
    } else {
      alert("Error");
    }
  }
}

function loadProducts(data) {
  const productsItems = document.querySelector(".products__items");

  data.products.forEach((item) => {
    const productId = item.id;
    const productUrl = item.url;
    const productImage = item.image;
    const productTitle = item.title;
    const productText = item.text;
    const productPrice = item.price;
    const productOldPrice = item.priceOld;
    const productShareUrl = item.shareUrl;
    const productLikeUrl = item.likeUrl;
    const productLabels = item.labels;

    let productTemplateStart = `<article data-pid="${productId}" class="products__item item-product">`;
    let productTemplateEnd = `</article>`;

    let productTemplateLabels = "";
    if (productLabels) {
      let productTemplateLabelsStart = `<div class="item-product__labels">`;
      let productTemplateLabelsEnd = `</div>`;
      let productTemplateLabelsContent = "";

      productLabels.forEach((labelItem) => {
        productTemplateLabelsContent += `<div class="item-product__label item-product__label_${labelItem.type}">${labelItem.value}</div>`;
      });

      productTemplateLabels += productTemplateLabelsStart;
      productTemplateLabels += productTemplateLabelsContent;
      productTemplateLabels += productTemplateLabelsEnd;
    }

    let productTemplateImage = `
		<a href="${productUrl}">
			<img class="item-product__img" src="../product-img/${productImage}" alt="${productTitle}">
		</a>
	`;

    let productTemplateBodyStart = `<div class="item-product__body">`;
    let productTemplateBodyEnd = `</div>`;

    let productTemplateContent = `
		<div class="item-product__content">
			<h3 class="item-product__title">${productTitle}</h3>
			<div class="item-product__text">${productText}</div>
		</div>
	`;

    let productTemplatePrices = "";
    let productTemplatePricesStart = `<div class="item-product__prices">`;
    let productTemplatePricesCurrent = `<div class="item-product__price"> ${productPrice}</div>`;
    let productTemplatePricesOld = `<div class="item-product__price item-product__price-old">${productOldPrice}</div>`;
    let productTemplatePricesEnd = `</div>`;

    productTemplatePrices = productTemplatePricesStart;
    productTemplatePrices += productTemplatePricesCurrent;
    if (productOldPrice) {
      productTemplatePrices += productTemplatePricesOld;
    }
    productTemplatePrices += productTemplatePricesEnd;

    let productTemplateActions = `
		<div class="item-product__actions actions-product">
			<div class="actions-product__body">
				<a href="" class="actions-product__button">Add to cart</a>
				<a href="${productShareUrl}" class="actions-product__link _icon-share">Share</a>
				<a href="${productLikeUrl}" class="actions-product__link _icon-heart">Like</a>
			</div>
		</div>
	`;

    let productTemplateBody = "";
    productTemplateBody += productTemplateBodyStart;
    productTemplateBody += productTemplateContent;
    productTemplateBody += productTemplatePrices;
    productTemplateBody += productTemplateActions;
    productTemplateBody += productTemplateBodyEnd;

    let productTemplate = "";
    productTemplate += productTemplateStart;
    productTemplate += productTemplateLabels;
    productTemplate += productTemplateImage;
    productTemplate += productTemplateBody;
    productTemplate += productTemplateEnd;

    productsItems.insertAdjacentHTML("beforeend", productTemplate);
  });
}
